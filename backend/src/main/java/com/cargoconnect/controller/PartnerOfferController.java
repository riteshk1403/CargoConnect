package com.cargoconnect.controller;

import com.cargoconnect.dto.PartnerBroadcastRequest;
import com.cargoconnect.dto.PartnerOfferResponseDto;
import com.cargoconnect.model.ShipmentPartnerOffer;
import com.cargoconnect.service.PartnerOfferService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/partner-offers")
public class PartnerOfferController {

    @Autowired
    private PartnerOfferService partnerOfferService;

    // 1. Discover eligible partners in territory
    @GetMapping("/eligible")
    public ResponseEntity<List<PartnerOfferService.EligiblePartnerDto>> findEligiblePartners(
            @RequestParam("shipmentId") Long shipmentId,
            @RequestParam(value = "lat", required = false) Double lat,
            @RequestParam(value = "lon", required = false) Double lon,
            @RequestParam(value = "radiusKm", defaultValue = "20.0") Double radiusKm) {
        return ResponseEntity.ok(partnerOfferService.findEligiblePartnersInRadius(shipmentId, lat, lon, radiusKm));
    }

    // 2. Broadcast shipment to eligible territory partners
    @PostMapping("/{shipmentId}/broadcast")
    public ResponseEntity<Map<String, Object>> broadcastShipment(
            @PathVariable Long shipmentId,
            @Valid @RequestBody PartnerBroadcastRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        int count = partnerOfferService.broadcastShipmentToTerritory(
                shipmentId, request.getPickupLatitude(), request.getPickupLongitude(), request.getRadiusKm(), adminUser);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Shipment successfully broadcasted to " + count + " eligible Cargo Partners.",
                "broadcastCount", count
        ));
    }

    // 3. Get all job offers for a Cargo Partner
    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<List<PartnerOfferResponseDto>> getOffersForPartner(@PathVariable Long partnerId) {
        return ResponseEntity.ok(partnerOfferService.getOffersForPartner(partnerId));
    }

    // 4. Partner Accepts Job Offer (Atomic Priority Ranking)
    @PostMapping("/{offerId}/accept")
    public ResponseEntity<ShipmentPartnerOffer> acceptOffer(
            @PathVariable Long offerId,
            @RequestParam("partnerId") Long partnerId) {
        return ResponseEntity.ok(partnerOfferService.partnerAcceptOffer(offerId, partnerId));
    }

    // 5. Partner Declines Job Offer
    @PostMapping("/{offerId}/decline")
    public ResponseEntity<ShipmentPartnerOffer> declineOffer(
            @PathVariable Long offerId,
            @RequestParam("partnerId") Long partnerId) {
        return ResponseEntity.ok(partnerOfferService.partnerDeclineOffer(offerId, partnerId));
    }

    // 6. Team checks responses for a shipment (Sorted by first acceptance priority)
    @GetMapping("/shipment/{shipmentId}/responses")
    public ResponseEntity<List<PartnerOfferResponseDto>> getShipmentResponses(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(partnerOfferService.getResponsesForShipment(shipmentId));
    }
}
