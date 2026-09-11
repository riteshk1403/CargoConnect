package com.cargoconnect.controller;

import com.cargoconnect.dto.DashboardStats;
import com.cargoconnect.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }

    @GetMapping("/shipper/{customerId}")
    public ResponseEntity<DashboardStats> getShipperDashboard(@PathVariable Long customerId) {
        return ResponseEntity.ok(reportService.getShipperDashboardStats(customerId));
    }

    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<DashboardStats> getPartnerDashboard(@PathVariable Long partnerId) {
        return ResponseEntity.ok(reportService.getPartnerDashboardStats(partnerId));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<DashboardStats> getDriverDashboard(@PathVariable Long driverId) {
        return ResponseEntity.ok(reportService.getDriverDashboardStats(driverId));
    }
}
