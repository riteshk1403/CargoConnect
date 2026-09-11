package com.cargoconnect.service;

import com.cargoconnect.dto.NearbyVehicleDto;
import com.cargoconnect.dto.OtpVerificationRequest;
import com.cargoconnect.dto.ShipmentBookingRequest;
import com.cargoconnect.dto.VehicleAssignmentRequest;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.*;
import com.cargoconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ProofOfDeliveryRepository proofOfDeliveryRepository;

    @Autowired
    private DocumentService documentService;

    @Autowired
    private CommissionService commissionService;

    @Autowired
    private CommissionSettlementService commissionSettlementService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    // Helper: 4-digit OTP generator
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int num = 1000 + random.nextInt(9000);
        return String.valueOf(num);
    }

    // Helper: Unique shipment ID (e.g. CC-10245)
    private String generateShipmentId() {
        SecureRandom random = new SecureRandom();
        return "CC-" + (10000 + random.nextInt(90000));
    }

    // 1. Create Shipment (NO automatic pricing -> Fare: Awaiting Quotation)
    @Transactional
    public Shipment bookShipment(ShipmentBookingRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        String shipmentNumber = generateShipmentId();
        String otp = generateOtp();

        Shipment shipment = Shipment.builder()
                .shipmentId(shipmentNumber)
                .customerId(customer.getId())
                .pickupAddress(request.getPickupAddress())
                .deliveryAddress(request.getDeliveryAddress())
                .pickupLatitude(request.getPickupLatitude() != null ? request.getPickupLatitude() : 18.5362)
                .pickupLongitude(request.getPickupLongitude() != null ? request.getPickupLongitude() : 73.7929)
                .deliveryLatitude(request.getDeliveryLatitude() != null ? request.getDeliveryLatitude() : 18.9220)
                .deliveryLongitude(request.getDeliveryLongitude() != null ? request.getDeliveryLongitude() : 72.8347)
                .goodsType(request.getGoodsType() != null ? request.getGoodsType() : "General Freight")
                .cargoDescription(request.getCargoDescription())
                .weight(request.getWeight())
                .vehicleTypeRequired(request.getVehicleTypeRequired() != null ? request.getVehicleTypeRequired() : "14 FT Truck")
                .pickupDate(request.getPickupDate())
                .pickupTime(request.getPickupTime() != null ? request.getPickupTime() : "10:00 AM")
                .deliveryDate(request.getDeliveryDate())
                .serviceType(request.getServiceType() != null ? request.getServiceType() : Shipment.ServiceType.NORMAL)
                .status(Shipment.Status.PENDING_ASSIGNMENT)
                // Manual Fare: Starts as null, awaiting team quotation
                .fare(null)
                .fareStatus(Shipment.FareStatus.PENDING)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : Shipment.PaymentMethod.ONLINE)
                .paymentStatus(Shipment.PaymentStatus.PENDING)
                .deliveryOtp(otp)
                .contactName(request.getContactName() != null ? request.getContactName() : customer.getName())
                .contactPhone(request.getContactPhone() != null ? request.getContactPhone() : customer.getPhone())
                .specialRequirements(request.getSpecialRequirements() != null ? request.getSpecialRequirements() : request.getSpecialInstructions())
                .cargoPhotoUrl(request.getCargoPhotoUrl())
                .routeCity("Pune to Mumbai")
                .createdAt(LocalDateTime.now())
                .build();

        Shipment saved = shipmentRepository.save(shipment);

        // Notify Admin & Customer
        notificationService.sendNotification(null, "ROLE_ADMIN",
                "New Consignment Order — " + saved.getShipmentId(),
                "Customer " + customer.getName() + " created shipment (" + saved.getWeight() + " kg, " + saved.getVehicleTypeRequired() + "). Fare quotation needed.",
                "NEW_SHIPMENT", "/admin/dispatch");

        notificationService.sendNotification(customer.getId(), "ROLE_SHIPPER",
                "Consignment Submitted — " + saved.getShipmentId(),
                "Your shipment has been registered. CargoConnect Team is reviewing details to provide a manual fare quotation.",
                "SHIPMENT_CREATED", "/shipper/shipments");

        auditLogService.log(customer.getName(), "ROLE_SHIPPER", "SHIPMENT_CREATED",
                "SHIPMENT", String.valueOf(saved.getId()), "Shipment created. Fare status: Awaiting Quotation");

        return saved;
    }

    // 2. Manual Fare Quotation by CargoConnect Team
    @Transactional
    public Shipment quoteFare(Long shipmentId, Double fare, String adminUsername) {
        Shipment shipment = getShipmentById(shipmentId);

        if (fare == null || fare <= 0) {
            throw new BadRequestException("Quoted fare must be positive.");
        }

        shipment.setFare(fare);
        shipment.setFareStatus(Shipment.FareStatus.QUOTED);
        shipment.setFareSetBy(adminUsername != null ? adminUsername : "CargoConnect Team");
        shipment.setFareSetAt(LocalDateTime.now());
        shipment.setStatus(Shipment.Status.QUOTED);

        Shipment saved = shipmentRepository.save(shipment);

        // Notify Shipper of quotation
        notificationService.sendNotification(saved.getCustomerId(), "ROLE_SHIPPER",
                "Quotation Available — " + saved.getShipmentId(),
                "CargoConnect Team quoted fare: ₹" + fare + ". Please review and Accept/Negotiate/Reject.",
                "QUOTATION_READY", "/shipper/shipments");

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "FARE_SET", "SHIPMENT", String.valueOf(saved.getId()),
                "Manual fare quoted: ₹" + fare);

        return saved;
    }

    // 3. Customer Responds to Quotation (ACCEPT, NEGOTIATE, REJECT)
    @Transactional
    public Shipment respondToQuotation(Long shipmentId, String response, String notes, String customerUsername) {
        Shipment shipment = getShipmentById(shipmentId);

        if (shipment.getFareStatus() != Shipment.FareStatus.QUOTED && shipment.getFareStatus() != Shipment.FareStatus.NEGOTIATE) {
            throw new BadRequestException("Shipment quotation is not in a reviewable state.");
        }

        String action = response != null ? response.toUpperCase().trim() : "ACCEPTED";
        if ("ACCEPTED".equals(action)) {
            shipment.setFareStatus(Shipment.FareStatus.ACCEPTED);
            shipment.setStatus(Shipment.Status.PENDING_ASSIGNMENT);
            notificationService.sendNotification(null, "ROLE_ADMIN",
                    "Quotation Accepted — " + shipment.getShipmentId(),
                    "Customer accepted fare ₹" + shipment.getFare() + ". Ready for territory partner broadcast.",
                    "QUOTE_ACCEPTED", "/admin/dispatch");
        } else if ("REJECTED".equals(action)) {
            shipment.setFareStatus(Shipment.FareStatus.REJECTED);
            shipment.setStatus(Shipment.Status.CANCELLED);
            notificationService.sendNotification(null, "ROLE_ADMIN",
                    "Quotation Rejected — " + shipment.getShipmentId(),
                    "Customer rejected fare quotation ₹" + shipment.getFare() + ". Reason: " + notes,
                    "QUOTE_REJECTED", "/admin/dispatch");
        } else {
            shipment.setFareStatus(Shipment.FareStatus.NEGOTIATE);
            notificationService.sendNotification(null, "ROLE_ADMIN",
                    "Fare Negotiation Requested — " + shipment.getShipmentId(),
                    "Customer requested fare discussion for ₹" + shipment.getFare() + ". Notes: " + notes,
                    "QUOTE_NEGOTIATE", "/admin/dispatch");
        }

        Shipment saved = shipmentRepository.save(shipment);

        auditLogService.log(customerUsername != null ? customerUsername : "customer", "ROLE_SHIPPER",
                "QUOTATION_" + action, "SHIPMENT", String.valueOf(saved.getId()),
                "Customer responded to quotation: " + action + ". Notes: " + notes);

        return saved;
    }

    // 4. Team Confirms Cargo Partner (Locks Commission Immutable)
    @Transactional
    public Shipment confirmCargoPartner(Long shipmentId, Long partnerId, String adminUsername) {
        Shipment shipment = getShipmentById(shipmentId);

        CargoPartner partner = cargoPartnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo Partner not found with id: " + partnerId));

        if (partner.getStatus() != CargoPartner.Status.ACTIVE || partner.getVerificationStatus() != CargoPartner.VerificationStatus.VERIFIED) {
            throw new BadRequestException("Selected Cargo Partner is not active and verified.");
        }

        if (shipment.getFare() == null || shipment.getFare() <= 0) {
            throw new BadRequestException("Cannot confirm partner without a valid fare.");
        }

        // Calculate and lock commission permanently
        CommissionService.CommissionResult comm = commissionService.calculateCommission(shipment.getFare());

        shipment.setConfirmedPartnerId(partner.getId());
        shipment.setCommissionRate(comm.commissionRate());
        shipment.setCommissionAmount(comm.commissionAmount());
        shipment.setPartnerAmount(comm.partnerAmount());
        shipment.setCommissionSetBy(adminUsername != null ? adminUsername : "admin");
        shipment.setCommissionSetAt(LocalDateTime.now());
        shipment.setConfirmedAt(LocalDateTime.now());
        shipment.setStatus(Shipment.Status.PARTNER_ACCEPTED);

        Shipment saved = shipmentRepository.save(shipment);

        // Generate Commission Settlement record in PENDING state
        commissionSettlementService.createSettlementForShipment(saved, partner.getId());

        // Notify Partner to allocate vehicle and driver
        notificationService.sendNotification(null, "ROLE_CARGO_PARTNER",
                "🎉 Assignment Confirmed — " + saved.getShipmentId(),
                "Your company " + partner.getCompanyName() + " was confirmed for " + saved.getShipmentId() + " (Fare: ₹" + saved.getFare() + ", Net Payout: ₹" + saved.getPartnerAmount() + "). Please assign your vehicle and driver.",
                "PARTNER_CONFIRMED", "/partner/dashboard");

        // Notify Customer
        notificationService.sendNotification(saved.getCustomerId(), "ROLE_SHIPPER",
                "Cargo Partner Assigned — " + saved.getShipmentId(),
                "Verified Partner " + partner.getCompanyName() + " has been assigned to your shipment.",
                "PARTNER_ASSIGNED", "/shipper/shipments");

        auditLogService.log(adminUsername != null ? adminUsername : "admin", "ROLE_ADMIN",
                "PARTNER_CONFIRMED", "SHIPMENT", String.valueOf(saved.getId()),
                "Confirmed partner: " + partner.getCompanyName() + ". Fare: ₹" + saved.getFare() + ", Commission (" + comm.commissionRate() + "%): ₹" + comm.commissionAmount() + ", Partner Payout: ₹" + comm.partnerAmount());

        return saved;
    }

    // 5. Cargo Partner Selects Vehicle & Assigns Driver from Own Fleet
    @Transactional
    public Shipment partnerAssignVehicleAndDriver(Long shipmentId, Long partnerId, Long vehicleId, Long driverId) {
        Shipment shipment = getShipmentById(shipmentId);

        if (!partnerId.equals(shipment.getConfirmedPartnerId())) {
            throw new BadRequestException("Shipment is not confirmed with this Cargo Partner.");
        }

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + vehicleId));

        if (!partnerId.equals(vehicle.getCargoPartnerId())) {
            throw new BadRequestException("Vehicle " + vehicle.getVehicleNumber() + " does not belong to your company fleet.");
        }

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));

        if (!partnerId.equals(driver.getCargoPartnerId())) {
            throw new BadRequestException("Driver " + driver.getName() + " is not registered under your company.");
        }

        // Compliance checks
        if (vehicle.getVerificationStatus() != Vehicle.VerificationStatus.VERIFIED) {
            throw new BadRequestException("Vehicle compliance documents are pending, expired, or rejected.");
        }
        if (driver.getVerificationStatus() != Driver.VerificationStatus.VERIFIED) {
            throw new BadRequestException("Driver license verification is pending, expired, or rejected.");
        }

        // Update Vehicle & Driver statuses
        vehicle.setStatus(Vehicle.Status.ASSIGNED);
        vehicle.setUsedCapacity(vehicle.getUsedCapacity() + shipment.getWeight());
        vehicleRepository.save(vehicle);

        driver.setStatus(Driver.Status.ASSIGNED);
        driver.setActiveShipmentId(shipment.getShipmentId());
        driverRepository.save(driver);

        // Update Shipment
        shipment.setAssignedVehicleId(vehicleId);
        shipment.setAssignedDriverId(driverId);
        shipment.setVehicleId(vehicleId);
        shipment.setDriverId(driverId);
        shipment.setStatus(Shipment.Status.ASSIGNED);

        Shipment saved = shipmentRepository.save(shipment);

        notificationService.sendNotification(saved.getCustomerId(), "ROLE_SHIPPER",
                "Driver & Vehicle Allocated — " + saved.getShipmentId(),
                "Driver " + driver.getName() + " (" + driver.getPhone() + ") allocated with vehicle " + vehicle.getVehicleNumber(),
                "FLEET_ALLOCATED", "/shipper/shipments");

        auditLogService.log("partner-" + partnerId, "ROLE_CARGO_PARTNER", "FLEET_ASSIGNED",
                "SHIPMENT", String.valueOf(saved.getId()),
                "Partner assigned vehicle " + vehicle.getVehicleNumber() + " and driver " + driver.getName());

        return saved;
    }

    // 6. Transit Lifecycle Advancement (ASSIGNED -> PICKED_UP -> IN_TRANSIT -> OUT_FOR_DELIVERY)
    @Transactional
    public Shipment advanceTransitState(Long shipmentId) {
        Shipment shipment = getShipmentById(shipmentId);

        switch (shipment.getStatus()) {
            case ASSIGNED -> {
                shipment.setStatus(Shipment.Status.PICKED_UP);
                notificationService.sendNotification(shipment.getCustomerId(), "ROLE_SHIPPER",
                        "Cargo Picked Up — " + shipment.getShipmentId(),
                        "Your consignment has been loaded and verified by driver at origin.",
                        "TRANSIT", "/shipper/shipments");
            }
            case PICKED_UP -> {
                shipment.setStatus(Shipment.Status.IN_TRANSIT);
                notificationService.sendNotification(shipment.getCustomerId(), "ROLE_SHIPPER",
                        "In Transit — " + shipment.getShipmentId(),
                        "Vehicle is on the highway en route to destination.",
                        "TRANSIT", "/shipper/shipments");
            }
            case IN_TRANSIT -> {
                shipment.setStatus(Shipment.Status.OUT_FOR_DELIVERY);
                notificationService.sendNotification(shipment.getCustomerId(), "ROLE_SHIPPER",
                        "Out for Delivery — " + shipment.getShipmentId(),
                        "Driver is approaching destination. Please share OTP " + shipment.getDeliveryOtp() + " with driver upon arrival.",
                        "TRANSIT", "/shipper/shipments");
            }
            default -> throw new BadRequestException("Cannot advance transit from state: " + shipment.getStatus());
        }

        Shipment saved = shipmentRepository.save(shipment);
        auditLogService.log("transit-engine", "SYSTEM", "TRANSIT_ADVANCED",
                "SHIPMENT", String.valueOf(saved.getId()), "Status moved to " + saved.getStatus());
        return saved;
    }

    // 7. Proof of Delivery Verification (Customer OTP)
    @Transactional
    public ProofOfDelivery verifyProofOfDelivery(Long shipmentId, OtpVerificationRequest request) {
        Shipment shipment = getShipmentById(shipmentId);

        if (shipment.getStatus() == Shipment.Status.DELIVERED) {
            throw new BadRequestException("Shipment has already been marked as DELIVERED.");
        }

        if (!shipment.getDeliveryOtp().equals(request.getEnteredOtp())) {
            throw new BadRequestException("Invalid recipient delivery OTP. Please verify with recipient.");
        }

        ProofOfDelivery pod = ProofOfDelivery.builder()
                .shipmentId(shipment.getId())
                .enteredOtp(request.getEnteredOtp())
                .signatureData(request.getSignatureData() != null ? request.getSignatureData() : "DIGITAL_OTP_VERIFIED")
                .photoUrl(request.getPhotoUrl())
                .notes(request.getNotes())
                .verifiedAt(LocalDateTime.now())
                .build();
        ProofOfDelivery savedPod = proofOfDeliveryRepository.save(pod);

        // Update Shipment
        shipment.setStatus(Shipment.Status.DELIVERED);
        shipment.setDeliveredAt(LocalDateTime.now());
        shipment.setPaymentStatus(Shipment.PaymentStatus.PAID);
        shipmentRepository.save(shipment);

        // Release Vehicle & Driver
        if (shipment.getAssignedVehicleId() != null) {
            vehicleRepository.findById(shipment.getAssignedVehicleId()).ifPresent(v -> {
                v.setStatus(Vehicle.Status.AVAILABLE);
                v.setUsedCapacity(Math.max(0.0, v.getUsedCapacity() - shipment.getWeight()));
                vehicleRepository.save(v);
            });
        }
        if (shipment.getAssignedDriverId() != null) {
            driverRepository.findById(shipment.getAssignedDriverId()).ifPresent(d -> {
                d.setStatus(Driver.Status.AVAILABLE);
                d.setActiveShipmentId(null);
                d.setTotalDeliveries(d.getTotalDeliveries() + 1);
                driverRepository.save(d);
            });
        }
        if (shipment.getConfirmedPartnerId() != null) {
            cargoPartnerRepository.findById(shipment.getConfirmedPartnerId()).ifPresent(p -> {
                p.setTotalTrips(p.getTotalTrips() + 1);
                cargoPartnerRepository.save(p);
            });
        }

        // Auto-generate itemized invoice
        invoiceService.generateInvoice(shipment);

        // Notify
        notificationService.sendNotification(shipment.getCustomerId(), "ROLE_SHIPPER",
                "✅ Consignment Delivered Successfully — " + shipment.getShipmentId(),
                "Proof of delivery confirmed. You can now download your invoice and rate your Cargo Partner.",
                "DELIVERY_COMPLETE", "/shipper/shipments");

        auditLogService.log("delivery-engine", "SYSTEM", "DELIVERY_COMPLETED",
                "SHIPMENT", String.valueOf(shipment.getId()), "Proof of delivery verified via customer OTP.");

        return savedPod;
    }

    // 8. Emergency Breakdown Reporting & Reassignment Request
    @Transactional
    public Shipment reportVehicleBreakdown(Long shipmentId, String reason, String partnerUsername) {
        Shipment shipment = getShipmentById(shipmentId);

        if (shipment.getAssignedVehicleId() != null) {
            vehicleRepository.findById(shipment.getAssignedVehicleId()).ifPresent(v -> {
                v.setStatus(Vehicle.Status.UNDER_MAINTENANCE);
                v.setRejectionReason("Reported breakdown on trip " + shipment.getShipmentId() + ": " + reason);
                vehicleRepository.save(v);
            });
        }

        shipment.setStatus(Shipment.Status.DELIVERY_FAILED);
        shipment.setNotes("Vehicle breakdown reported: " + reason);
        Shipment saved = shipmentRepository.save(shipment);

        // Notify Team for emergency reassignment broadcast
        notificationService.sendNotification(null, "ROLE_ADMIN",
                "🚨 Vehicle Breakdown Reported — " + saved.getShipmentId(),
                "Partner reported breakdown: " + reason + ". Reassignment required.",
                "EMERGENCY", "/admin/dispatch");

        notificationService.sendNotification(saved.getCustomerId(), "ROLE_SHIPPER",
                "Shipment Delayed — Attention Required",
                "A technical transit issue was reported for " + saved.getShipmentId() + ". CargoConnect operations team is reallocating backup fleet.",
                "DELAYED", "/shipper/shipments");

        auditLogService.log(partnerUsername, "ROLE_CARGO_PARTNER", "VEHICLE_BREAKDOWN",
                "SHIPMENT", String.valueOf(saved.getId()), "Breakdown reported: " + reason);

        return saved;
    }

    // Queries
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + id));
    }

    public List<Shipment> getShipmentsByCustomer(Long customerId) {
        return shipmentRepository.findByCustomerId(customerId);
    }

    public List<Shipment> getShipmentsByPartner(Long partnerId) {
        return shipmentRepository.findByConfirmedPartnerId(partnerId);
    }

    public List<Shipment> getShipmentsByDriver(Long driverId) {
        return shipmentRepository.findByAssignedDriverId(driverId);
    }

    public List<Shipment> getShipmentsByStatus(Shipment.Status status) {
        return shipmentRepository.findByStatus(status);
    }
}
