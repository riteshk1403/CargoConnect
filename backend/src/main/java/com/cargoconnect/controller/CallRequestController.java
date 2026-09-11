package com.cargoconnect.controller;

import com.cargoconnect.dto.CallRequestDto;
import com.cargoconnect.model.CallRequest;
import com.cargoconnect.service.CallRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/call-requests")
public class CallRequestController {

    @Autowired
    private CallRequestService callRequestService;

    @PostMapping
    public ResponseEntity<CallRequest> createCallRequest(
            @Valid @RequestBody CallRequestDto dto,
            Authentication authentication) {
        String customerName = authentication != null ? authentication.getName() : "Customer";
        return ResponseEntity.ok(callRequestService.createCallRequest(dto, customerName));
    }

    @GetMapping
    public ResponseEntity<List<CallRequest>> getAllCallRequests() {
        return ResponseEntity.ok(callRequestService.getAllRequests());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CallRequest>> getCustomerCallRequests(@PathVariable Long customerId) {
        return ResponseEntity.ok(callRequestService.getCustomerRequests(customerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CallRequest> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        String statusStr = body.getOrDefault("status", "RESOLVED");
        String admin = authentication != null ? authentication.getName() : "admin";
        CallRequest.Status status = CallRequest.Status.valueOf(statusStr);
        return ResponseEntity.ok(callRequestService.updateStatus(id, status, admin));
    }
}
