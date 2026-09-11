package com.cargoconnect.controller;

import com.cargoconnect.model.Payment;
import com.cargoconnect.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping("/{id}/online-success")
    public ResponseEntity<Payment> processOnlineSuccess(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.processOnlinePaymentSuccess(id));
    }
}
