package com.cargoconnect.controller;

import com.cargoconnect.model.CargoPartner;
import com.cargoconnect.model.Driver;
import com.cargoconnect.model.Vehicle;
import com.cargoconnect.service.CargoPartnerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/partners")
public class CargoPartnerController {

    @Autowired
    private CargoPartnerService cargoPartnerService;

    @GetMapping
    public ResponseEntity<List<CargoPartner>> getAllPartners() {
        return ResponseEntity.ok(cargoPartnerService.getAllPartners());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CargoPartner> getPartnerById(@PathVariable Long id) {
        return ResponseEntity.ok(cargoPartnerService.getPartnerById(id));
    }

    @PostMapping
    public ResponseEntity<CargoPartner> createPartner(@Valid @RequestBody CargoPartner partner) {
        return ResponseEntity.ok(cargoPartnerService.createPartner(partner));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CargoPartner> updatePartner(@PathVariable Long id, @RequestBody CargoPartner req) {
        return ResponseEntity.ok(cargoPartnerService.updatePartner(id, req));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<CargoPartner> verifyPartner(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String statusStr = body.getOrDefault("status", "VERIFIED");
        String reason = body.getOrDefault("reason", "");
        String adminUser = authentication != null ? authentication.getName() : "admin";
        CargoPartner.VerificationStatus status = CargoPartner.VerificationStatus.valueOf(statusStr);
        return ResponseEntity.ok(cargoPartnerService.verifyPartner(id, status, reason, adminUser));
    }

    // ================= FLEET VEHICLES =================
    @GetMapping("/{id}/vehicles")
    public ResponseEntity<List<Vehicle>> getPartnerVehicles(@PathVariable Long id) {
        return ResponseEntity.ok(cargoPartnerService.getPartnerVehicles(id));
    }

    @PostMapping("/{id}/vehicles")
    public ResponseEntity<Vehicle> addPartnerVehicle(@PathVariable Long id, @Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(cargoPartnerService.addVehicle(id, vehicle));
    }

    @PutMapping("/{id}/vehicles/{vehicleId}")
    public ResponseEntity<Vehicle> updatePartnerVehicle(
            @PathVariable Long id,
            @PathVariable Long vehicleId,
            @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(cargoPartnerService.updateVehicle(id, vehicleId, vehicle));
    }

    // ================= FLEET DRIVERS =================
    @GetMapping("/{id}/drivers")
    public ResponseEntity<List<Driver>> getPartnerDrivers(@PathVariable Long id) {
        return ResponseEntity.ok(cargoPartnerService.getPartnerDrivers(id));
    }

    @PostMapping("/{id}/drivers")
    public ResponseEntity<Driver> addPartnerDriver(@PathVariable Long id, @Valid @RequestBody Driver driver) {
        return ResponseEntity.ok(cargoPartnerService.addDriver(id, driver));
    }

    @PutMapping("/{id}/drivers/{driverId}")
    public ResponseEntity<Driver> updatePartnerDriver(
            @PathVariable Long id,
            @PathVariable Long driverId,
            @RequestBody Driver driver) {
        return ResponseEntity.ok(cargoPartnerService.updateDriver(id, driverId, driver));
    }
}
