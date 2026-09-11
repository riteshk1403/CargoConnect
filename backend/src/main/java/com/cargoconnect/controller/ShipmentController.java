package com.cargoconnect.controller;

import com.cargoconnect.dto.FareQuoteRequest;
import com.cargoconnect.dto.OtpVerificationRequest;
import com.cargoconnect.dto.PartnerAssignmentRequest;
import com.cargoconnect.dto.QuoteResponseRequest;
import com.cargoconnect.dto.ShipmentBookingRequest;
import com.cargoconnect.model.ProofOfDelivery;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    // 1. Create Consignment (Fare starts as Awaiting Quotation)
    @PostMapping("/book")
    public ResponseEntity<Shipment> bookShipment(@Valid @RequestBody ShipmentBookingRequest request) {
        return ResponseEntity.ok(shipmentService.bookShipment(request));
    }

    // 2. Team Manually Sets Fare Quotation
    @PostMapping("/{id}/quote")
    public ResponseEntity<Shipment> quoteFare(
            @PathVariable Long id,
            @Valid @RequestBody FareQuoteRequest request,
            Authentication authentication) {
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(shipmentService.quoteFare(id, request.getFare(), adminUser));
    }

    // 3. Customer Responds to Quotation (ACCEPT, NEGOTIATE, REJECT)
    @PostMapping("/{id}/quote-response")
    public ResponseEntity<Shipment> respondToQuotation(
            @PathVariable Long id,
            @Valid @RequestBody QuoteResponseRequest request,
            Authentication authentication) {
        String customerUser = authentication != null ? authentication.getName() : "customer";
        return ResponseEntity.ok(shipmentService.respondToQuotation(id, request.getResponse(), request.getNotes(), customerUser));
    }

    // 4. Team Confirms Cargo Partner (Calculates & locks immutable commission)
    @PostMapping("/{id}/confirm-partner")
    public ResponseEntity<Shipment> confirmPartner(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body,
            Authentication authentication) {
        Long partnerId = body.get("partnerId");
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(shipmentService.confirmCargoPartner(id, partnerId, adminUser));
    }

    // 5. Cargo Partner Selects Vehicle & Assigns Driver from Company Fleet
    @PostMapping("/{id}/partner-assign")
    public ResponseEntity<Shipment> partnerAssignFleet(
            @PathVariable Long id,
            @RequestParam("partnerId") Long partnerId,
            @Valid @RequestBody PartnerAssignmentRequest request) {
        return ResponseEntity.ok(shipmentService.partnerAssignVehicleAndDriver(id, partnerId, request.getVehicleId(), request.getDriverId()));
    }

    // 6. Transit Lifecycle Advancement (ASSIGNED -> PICKED_UP -> IN_TRANSIT -> OUT_FOR_DELIVERY)
    @PostMapping("/{id}/transit")
    public ResponseEntity<Shipment> advanceTransit(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.advanceTransitState(id));
    }

    // 7. Recipient OTP Verification & Delivery Confirmation
    @PostMapping("/{id}/verify-otp")
    public ResponseEntity<ProofOfDelivery> verifyDeliveryOtp(
            @PathVariable Long id,
            @Valid @RequestBody OtpVerificationRequest request) {
        return ResponseEntity.ok(shipmentService.verifyProofOfDelivery(id, request));
    }

    // 8. Vehicle Breakdown Reporting
    @PostMapping("/{id}/breakdown")
    public ResponseEntity<Shipment> reportBreakdown(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String reason = body.getOrDefault("reason", "Mechanical failure reported by driver.");
        String username = authentication != null ? authentication.getName() : "partner";
        return ResponseEntity.ok(shipmentService.reportVehicleBreakdown(id, reason, username));
    }

    // Queries
    @GetMapping
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Shipment>> getCustomerShipments(@PathVariable Long customerId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByCustomer(customerId));
    }

    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<List<Shipment>> getPartnerShipments(@PathVariable Long partnerId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByPartner(partnerId));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Shipment>> getDriverShipments(@PathVariable Long driverId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByDriver(driverId));
    }
}
