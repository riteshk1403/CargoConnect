package com.cargoconnect.controller;

import com.cargoconnect.model.Driver;
import com.cargoconnect.model.Vehicle;
import com.cargoconnect.service.SimulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/simulator")
public class SimulatorController {
    @Autowired
    private SimulatorService simulatorService;

    @PostMapping("/breakdown/{vehicleId}")
    public ResponseEntity<Vehicle> simulateBreakdown(
            @PathVariable Long vehicleId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Engine malfunction";
        return ResponseEntity.ok(simulatorService.triggerVehicleBreakdown(vehicleId, reason));
    }

    @PostMapping("/driver-sick/{driverId}")
    public ResponseEntity<Driver> simulateDriverSick(
            @PathVariable Long driverId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Emergency medical leave";
        return ResponseEntity.ok(simulatorService.triggerDriverSickLeave(driverId, reason));
    }
}
