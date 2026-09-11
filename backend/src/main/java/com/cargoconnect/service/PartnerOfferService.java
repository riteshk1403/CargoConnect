package com.cargoconnect.service;

import com.cargoconnect.dto.PartnerOfferResponseDto;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.*;
import com.cargoconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PartnerOfferService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ShipmentPartnerOfferRepository offerRepository;

    @Autowired
    private CommissionSettlementService commissionSettlementService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    // Haversine Great-Circle Distance in Kilometers
    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((R * c) * 10.0) / 10.0;
    }

    public record EligiblePartnerDto(
            Long partnerId,
            String companyName,
            String ownerName,
            String phone,
            String address,
            String city,
            Double latitude,
            Double longitude,
            Double distanceKm,
            Double rating,
            int totalTrips,
            boolean isEligible,
            String eligibilityReason,
            int availableVehiclesCount,
            int availableDriversCount
    ) {}

    // Find all Cargo Partners in radius and check vehicle/driver compliance
    public List<EligiblePartnerDto> findEligiblePartnersInRadius(Long shipmentId, Double centerLat, Double centerLon, Double radiusKm) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        double lat = (centerLat != null && centerLat > 0) ? centerLat : ((shipment.getPickupLatitude() != null && shipment.getPickupLatitude() > 0) ? shipment.getPickupLatitude() : 18.5362);
        double lon = (centerLon != null && centerLon > 0) ? centerLon : ((shipment.getPickupLongitude() != null && shipment.getPickupLongitude() > 0) ? shipment.getPickupLongitude() : 73.7929);
        double radius = (radiusKm != null && radiusKm > 0) ? radiusKm : 50.0;

        List<CargoPartner> allPartners = cargoPartnerRepository.findAll();
        List<EligiblePartnerDto> result = new ArrayList<>();

        for (CargoPartner p : allPartners) {
            double pLat = (p.getLatitude() != null && p.getLatitude() > 0) ? p.getLatitude() : 18.5362;
            double pLon = (p.getLongitude() != null && p.getLongitude() > 0) ? p.getLongitude() : 73.7929;
            double distance = calculateDistanceKm(lat, lon, pLat, pLon);

            if (distance <= radius) {
                // Check vehicles & drivers
                List<Vehicle> partnerVehicles = vehicleRepository.findByCargoPartnerId(p.getId());
                List<Driver> partnerDrivers = driverRepository.findByCargoPartnerId(p.getId());

                double shipmentWeight = shipment.getWeight() != null ? shipment.getWeight() : 0.0;

                long eligibleVehicles = partnerVehicles.stream()
                        .filter(v -> v.getStatus() == Vehicle.Status.AVAILABLE
                                && v.getVerificationStatus() == Vehicle.VerificationStatus.VERIFIED
                                && (shipmentWeight <= 0 || v.getRemainingCapacity() >= shipmentWeight))
                        .count();

                long eligibleDrivers = partnerDrivers.stream()
                        .filter(d -> d.getStatus() == Driver.Status.AVAILABLE
                                && d.getVerificationStatus() == Driver.VerificationStatus.VERIFIED)
                        .count();

                boolean isEligibleForNewOrders = commissionSettlementService.isPartnerEligibleForNewOrders(p.getId());
                Double pendingCommAmount = commissionSettlementService.getPendingCommissionAmountForPartner(p.getId());

                boolean isEligible = p.getStatus() == CargoPartner.Status.ACTIVE
                        && p.getVerificationStatus() == CargoPartner.VerificationStatus.VERIFIED
                        && isEligibleForNewOrders
                        && eligibleVehicles > 0
                        && eligibleDrivers > 0;

                String reason;
                if (p.getStatus() != CargoPartner.Status.ACTIVE) {
                    reason = "Partner account is inactive";
                } else if (p.getVerificationStatus() != CargoPartner.VerificationStatus.VERIFIED) {
                    reason = "Partner verification is pending or rejected";
                } else if (!isEligibleForNewOrders) {
                    reason = "Blocked: Required commission settlement payment pending (₹" + pendingCommAmount + "). Please clear commission to receive new orders.";
                } else if (eligibleVehicles == 0) {
                    reason = partnerVehicles.isEmpty() ? "No vehicles registered in partner fleet" : "No available verified vehicle with capacity >= " + shipmentWeight + " kg";
                } else if (eligibleDrivers == 0) {
                    reason = partnerDrivers.isEmpty() ? "No drivers registered in partner fleet" : "No available verified driver on duty";
                } else {
                    reason = "Eligible and ready for dispatch";
                }

                result.add(new EligiblePartnerDto(
                        p.getId(),
                        p.getCompanyName(),
                        p.getOwnerName(),
                        p.getPhone(),
                        p.getAddress(),
                        p.getCity(),
                        pLat,
                        pLon,
                        distance,
                        p.getRating(),
                        p.getTotalTrips(),
                        isEligible,
                        reason,
                        (int) eligibleVehicles,
                        (int) eligibleDrivers
                ));
            }
        }

        // Sort by distance ascending
        result.sort(Comparator.comparing(EligiblePartnerDto::distanceKm));
        return result;
    }

    // Broadcast shipment to all eligible partners in territory
    @Transactional
    public int broadcastShipmentToTerritory(Long shipmentId, Double lat, Double lon, Double radiusKm, String adminUsername) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        if (shipment.getFare() == null || shipment.getFare() <= 0) {
            throw new BadRequestException("Cannot broadcast shipment before setting a manual quotation fare.");
        }

        double finalRadius = (radiusKm != null && radiusKm > 0) ? radiusKm : 50.0;
        List<EligiblePartnerDto> eligiblePartners = findEligiblePartnersInRadius(shipmentId, lat, lon, finalRadius);
        List<EligiblePartnerDto> qualifiedOnly = eligiblePartners.stream().filter(EligiblePartnerDto::isEligible).toList();

        // Fallback: If no partners strictly matched the weight/fleet filter, include all active verified partners in radius
        List<EligiblePartnerDto> targetPartners = qualifiedOnly;
        if (targetPartners.isEmpty()) {
            targetPartners = eligiblePartners.stream()
                    .filter(p -> {
                        CargoPartner cp = cargoPartnerRepository.findById(p.partnerId()).orElse(null);
                        return cp != null && cp.getStatus() == CargoPartner.Status.ACTIVE
                                && cp.getVerificationStatus() == CargoPartner.VerificationStatus.VERIFIED
                                && commissionSettlementService.isPartnerEligibleForNewOrders(cp.getId());
                    })
                    .toList();
        }

        if (targetPartners.isEmpty()) {
            throw new BadRequestException("No active, verified Cargo Partners found within " + finalRadius + " KM radius. Please ensure partners have active accounts and settled commissions.");
        }

        shipment.setBroadcastRadiusKm(finalRadius);
        shipment.setBroadcastAt(LocalDateTime.now());
        shipment.setStatus(Shipment.Status.PARTNER_NOTIFIED);
        shipmentRepository.save(shipment);

        int broadcastCount = 0;
        for (EligiblePartnerDto pDto : targetPartners) {
            Optional<ShipmentPartnerOffer> existing = offerRepository.findByShipmentIdAndCargoPartnerId(shipmentId, pDto.partnerId());
            ShipmentPartnerOffer offer;
            if (existing.isPresent()) {
                offer = existing.get();
                offer.setStatus(ShipmentPartnerOffer.OfferStatus.SENT);
                offer.setNotifiedAt(LocalDateTime.now());
                offer.setRespondedAt(null);
                offer.setAcceptancePriority(null);
            } else {
                offer = ShipmentPartnerOffer.builder()
                        .shipmentId(shipmentId)
                        .cargoPartnerId(pDto.partnerId())
                        .partnerDistanceKm(pDto.distanceKm())
                        .status(ShipmentPartnerOffer.OfferStatus.SENT)
                        .notifiedAt(LocalDateTime.now())
                        .build();
            }
            offerRepository.save(offer);
            broadcastCount++;

            // Push in-app job notification
            notificationService.sendNotification(null, "ROLE_CARGO_PARTNER",
                    "NEW CARGO REQUEST — " + shipment.getShipmentId(),
                    "Pickup: " + shipment.getPickupAddress() + " (" + pDto.distanceKm() + " km) • Fare: ₹" + shipment.getFare() + " • Weight: " + shipment.getWeight() + " kg",
                    "BROADCAST", "/partner/dashboard");
        }

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "SHIPMENT_BROADCAST", "SHIPMENT", String.valueOf(shipment.getId()),
                "Broadcasted to " + broadcastCount + " eligible Cargo Partners in " + radiusKm + " KM radius.");

        return broadcastCount;
    }

    // Partner Accepts Job Request (Atomic Transaction & Priority Ranking)
    @Transactional
    public synchronized ShipmentPartnerOffer partnerAcceptOffer(Long offerId, Long partnerId) {
        ShipmentPartnerOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + offerId));

        if (!offer.getCargoPartnerId().equals(partnerId)) {
            throw new BadRequestException("This job offer does not belong to your partner account.");
        }

        if (offer.getStatus() == ShipmentPartnerOffer.OfferStatus.ACCEPTED) {
            return offer; // Already accepted
        }

        Shipment shipment = shipmentRepository.findById(offer.getShipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found."));

        if (shipment.getStatus() == Shipment.Status.ASSIGNED || shipment.getStatus() == Shipment.Status.DELIVERED || shipment.getStatus() == Shipment.Status.CANCELLED) {
            throw new BadRequestException("Shipment has already been assigned or closed.");
        }

        // Count how many partners have already accepted this shipment
        long alreadyAcceptedCount = offerRepository.countAcceptedOffers(offer.getShipmentId());
        int priorityRank = (int) alreadyAcceptedCount + 1;

        offer.setStatus(ShipmentPartnerOffer.OfferStatus.ACCEPTED);
        offer.setRespondedAt(LocalDateTime.now());
        offer.setAcceptancePriority(priorityRank);
        ShipmentPartnerOffer saved = offerRepository.save(offer);

        shipment.setStatus(Shipment.Status.PARTNER_ACCEPTED);
        shipmentRepository.save(shipment);

        CargoPartner partner = cargoPartnerRepository.findById(partnerId).orElse(null);
        String partnerName = partner != null ? partner.getCompanyName() : "Partner #" + partnerId;

        // Notify Admin team of partner response
        notificationService.sendNotification(null, "ROLE_ADMIN",
                "Job Offer Accepted — Priority #" + priorityRank,
                partnerName + " accepted shipment " + shipment.getShipmentId() + " (Rank #" + priorityRank + ")",
                "OFFER_ACCEPTED", "/admin/dispatch");

        auditLogService.log(partnerName, "ROLE_CARGO_PARTNER",
                "PARTNER_ACCEPTED", "SHIPMENT", String.valueOf(shipment.getId()),
                "Partner accepted job offer with Priority Rank #" + priorityRank);

        return saved;
    }

    // Partner Declines Job Request
    @Transactional
    public ShipmentPartnerOffer partnerDeclineOffer(Long offerId, Long partnerId) {
        ShipmentPartnerOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + offerId));

        if (!offer.getCargoPartnerId().equals(partnerId)) {
            throw new BadRequestException("This job offer does not belong to your partner account.");
        }

        offer.setStatus(ShipmentPartnerOffer.OfferStatus.DECLINED);
        offer.setRespondedAt(LocalDateTime.now());
        return offerRepository.save(offer);
    }

    // Get all job offers for a partner
    public List<PartnerOfferResponseDto> getOffersForPartner(Long partnerId) {
        List<ShipmentPartnerOffer> offers = offerRepository.findByCargoPartnerId(partnerId);
        List<PartnerOfferResponseDto> result = new ArrayList<>();

        for (ShipmentPartnerOffer o : offers) {
            shipmentRepository.findById(o.getShipmentId()).ifPresent(s -> {
                result.add(PartnerOfferResponseDto.builder()
                        .offerId(o.getId())
                        .shipmentId(s.getId())
                        .shipmentNumber(s.getShipmentId())
                        .cargoPartnerId(partnerId)
                        .pickupAddress(s.getPickupAddress())
                        .deliveryAddress(s.getDeliveryAddress())
                        .cargoType(s.getGoodsType() != null ? s.getGoodsType() : s.getCargoDescription())
                        .weight(s.getWeight())
                        .vehicleTypeRequired(s.getVehicleTypeRequired() != null ? s.getVehicleTypeRequired() : "Standard Truck")
                        .fare(s.getFare())
                        .pickupDate(s.getPickupDate() != null ? s.getPickupDate().toString() : "Flexible")
                        .pickupTime(s.getPickupTime() != null ? s.getPickupTime() : "Anytime")
                        .partnerDistanceKm(o.getPartnerDistanceKm())
                        .offerStatus(o.getStatus().name())
                        .acceptancePriority(o.getAcceptancePriority())
                        .notifiedAt(o.getNotifiedAt())
                        .respondedAt(o.getRespondedAt())
                        .build());
            });
        }

        // Sort: SENT first, then newest
        result.sort((a, b) -> {
            if ("SENT".equals(a.getOfferStatus()) && !"SENT".equals(b.getOfferStatus())) return -1;
            if (!"SENT".equals(a.getOfferStatus()) && "SENT".equals(b.getOfferStatus())) return 1;
            if (b.getNotifiedAt() != null && a.getNotifiedAt() != null) return b.getNotifiedAt().compareTo(a.getNotifiedAt());
            return 0;
        });

        return result;
    }

    // Get partner responses for a shipment (sorted by First-Acceptance Priority)
    public List<PartnerOfferResponseDto> getResponsesForShipment(Long shipmentId) {
        List<ShipmentPartnerOffer> offers = offerRepository.findByShipmentId(shipmentId);
        List<PartnerOfferResponseDto> result = new ArrayList<>();

        for (ShipmentPartnerOffer o : offers) {
            CargoPartner p = cargoPartnerRepository.findById(o.getCargoPartnerId()).orElse(null);
            shipmentRepository.findById(shipmentId).ifPresent(s -> {
                result.add(PartnerOfferResponseDto.builder()
                        .offerId(o.getId())
                        .shipmentId(s.getId())
                        .shipmentNumber(s.getShipmentId())
                        .cargoPartnerId(o.getCargoPartnerId())
                        .partnerCompanyName(p != null ? p.getCompanyName() : "Partner #" + o.getCargoPartnerId())
                        .pickupAddress(s.getPickupAddress())
                        .deliveryAddress(s.getDeliveryAddress())
                        .cargoType(s.getGoodsType())
                        .weight(s.getWeight())
                        .vehicleTypeRequired(s.getVehicleTypeRequired())
                        .fare(s.getFare())
                        .pickupDate(s.getPickupDate() != null ? s.getPickupDate().toString() : "")
                        .pickupTime(s.getPickupTime())
                        .partnerDistanceKm(o.getPartnerDistanceKm())
                        .offerStatus(o.getStatus().name())
                        .acceptancePriority(o.getAcceptancePriority())
                        .notifiedAt(o.getNotifiedAt())
                        .respondedAt(o.getRespondedAt())
                        .build());
            });
        }

        // Sort: ACCEPTED first by acceptancePriority ascending, then other responses
        result.sort((a, b) -> {
            boolean aAcc = "ACCEPTED".equals(a.getOfferStatus());
            boolean bAcc = "ACCEPTED".equals(b.getOfferStatus());
            if (aAcc && !bAcc) return -1;
            if (!aAcc && bAcc) return 1;
            if (aAcc && bAcc) {
                int pA = a.getAcceptancePriority() != null ? a.getAcceptancePriority() : 999;
                int pB = b.getAcceptancePriority() != null ? b.getAcceptancePriority() : 999;
                return Integer.compare(pA, pB);
            }
            return 0;
        });

        return result;
    }
}
