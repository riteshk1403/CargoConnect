package com.cargoconnect.service;

import com.cargoconnect.dto.ComplaintRequest;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Complaint;
import com.cargoconnect.model.Driver;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.repository.ComplaintRepository;
import com.cargoconnect.repository.DriverRepository;
import com.cargoconnect.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
    }

    public List<Complaint> getComplaintsByCustomer(Long customerId) {
        return complaintRepository.findByCustomerId(customerId);
    }

    public Complaint raiseComplaint(ComplaintRequest request, String username) {
        String code = "CMP-" + (1000 + new Random().nextInt(9000));

        Complaint complaint = Complaint.builder()
                .complaintId(code)
                .customerId(request.getCustomerId())
                .shipmentId(request.getShipmentId())
                .type(request.getType())
                .description(request.getDescription())
                .status(Complaint.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        complaint = complaintRepository.save(complaint);

        notificationService.createNotification(null, "ROLE_ADMIN", "New Complaint Ticket",
                "Ticket " + code + " filed for type: " + request.getType().name(), "ALERT", "/admin/complaints");

        auditLogService.log(username, "SHIPPER", "COMPLAINT_RAISED", "COMPLAINT",
                String.valueOf(complaint.getId()), "Filed complaint ticket: " + code);

        return complaint;
    }

    @Transactional
    public Complaint resolveComplaint(Long id, String resolution, String actionTaken, Double customAmount, String adminUsername) {
        Complaint complaint = getComplaintById(id);
        if (complaint.getStatus() == Complaint.Status.RESOLVED || complaint.getStatus() == Complaint.Status.REJECTED) {
            throw new BadRequestException("Complaint ticket is already closed.");
        }

        Shipment shipment = null;
        if (complaint.getShipmentId() != null) {
            shipment = shipmentRepository.findById(complaint.getShipmentId()).orElse(null);
        }

        double refund = 0.0;
        if ("FULL_REFUND".equalsIgnoreCase(resolution)) {
            complaint.setStatus(Complaint.Status.RESOLVED);
            if (shipment != null && shipment.getPrice() != null) {
                refund = shipment.getPrice();
                paymentService.processPaymentRefund(shipment.getId(), refund);
            }
            complaint.setActionTaken(actionTaken != null ? actionTaken : "Approved Full Refund of $" + String.format("%.2f", refund));
            complaint.setRefundAmount(refund);
        } else if ("PARTIAL_REFUND".equalsIgnoreCase(resolution)) {
            complaint.setStatus(Complaint.Status.RESOLVED);
            refund = customAmount != null && customAmount > 0 ? customAmount : (shipment != null && shipment.getPrice() != null ? shipment.getPrice() * 0.5 : 50.0);
            if (shipment != null) {
                paymentService.processPaymentRefund(shipment.getId(), refund);
            }
            complaint.setActionTaken(actionTaken != null ? actionTaken : "Approved Partial Refund of $" + String.format("%.2f", refund));
            complaint.setRefundAmount(refund);
        } else if ("REJECT".equalsIgnoreCase(resolution) || "REJECTED".equalsIgnoreCase(resolution)) {
            complaint.setStatus(Complaint.Status.REJECTED);
            complaint.setActionTaken(actionTaken != null ? actionTaken : "Complaint dismissed after review.");
        } else if ("SUSPEND_DRIVER".equalsIgnoreCase(resolution)) {
            complaint.setStatus(Complaint.Status.RESOLVED);
            if (shipment != null && shipment.getDriverId() != null) {
                driverRepository.findById(shipment.getDriverId()).ifPresent(d -> {
                    d.setStatus(Driver.Status.UNAVAILABLE);
                    driverRepository.save(d);
                });
            }
            complaint.setActionTaken(actionTaken != null ? actionTaken : "Driver suspended due to misconduct.");
        } else {
            complaint.setStatus(Complaint.Status.RESOLVED);
            complaint.setActionTaken(actionTaken != null ? actionTaken : "Complaint reviewed and resolved.");
        }

        complaint.setResolvedAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        notificationService.createNotification(complaint.getCustomerId(), "ROLE_SHIPPER", "Complaint Resolved",
                "Your ticket " + complaint.getComplaintId() + " was resolved: " + complaint.getActionTaken(), "SUCCESS", "/shipper/complaints");

        auditLogService.log(adminUsername, "ADMIN", "COMPLAINT_RESOLVED", "COMPLAINT",
                String.valueOf(complaint.getId()), "Resolved ticket " + complaint.getComplaintId() + " with action: " + complaint.getActionTaken());

        return complaint;
    }
}
