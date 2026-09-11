package com.cargoconnect.controller;

import com.cargoconnect.model.Invoice;
import com.cargoconnect.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<Invoice> getInvoiceByShipment(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(invoiceService.getInvoiceByShipmentId(shipmentId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Invoice>> getInvoicesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByCustomerId(customerId));
    }
}
