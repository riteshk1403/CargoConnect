package com.cargoconnect.controller;

import com.cargoconnect.dto.ComplaintRequest;
import com.cargoconnect.dto.ComplaintResolveRequest;
import com.cargoconnect.model.Complaint;
import com.cargoconnect.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Complaint>> getComplaintsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(complaintService.getComplaintsByCustomer(customerId));
    }

    @PostMapping
    public ResponseEntity<Complaint> raiseComplaint(@Valid @RequestBody ComplaintRequest request, Authentication auth) {
        String username = auth != null ? auth.getName() : "customer";
        return ResponseEntity.ok(complaintService.raiseComplaint(request, username));
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Complaint> resolveComplaint(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintResolveRequest request,
            Authentication auth) {
        String adminUser = auth != null ? auth.getName() : "admin";
        return ResponseEntity.ok(complaintService.resolveComplaint(id, request.getResolution(), request.getActionTaken(), request.getCustomAmount(), adminUser));
    }
}
