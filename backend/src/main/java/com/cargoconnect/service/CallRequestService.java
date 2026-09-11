package com.cargoconnect.service;

import com.cargoconnect.dto.CallRequestDto;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.CallRequest;
import com.cargoconnect.repository.CallRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CallRequestService {
    @Autowired
    private CallRequestRepository callRequestRepository;

    @Autowired
    private NotificationService notificationService;

    public CallRequest createCallRequest(CallRequestDto dto, String customerName) {
        CallRequest req = CallRequest.builder()
                .customerId(dto.getCustomerId())
                .customerName(customerName)
                .shipmentId(dto.getShipmentId())
                .reason(CallRequest.Reason.valueOf(dto.getReason()))
                .preferredTime(dto.getPreferredTime())
                .contactPhone(dto.getContactPhone())
                .notes(dto.getNotes())
                .status(CallRequest.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        CallRequest saved = callRequestRepository.save(req);

        notificationService.sendNotification(null, "ROLE_ADMIN",
                "📞 Call Request from " + customerName,
                "Reason: " + dto.getReason() + " • Phone: " + dto.getContactPhone() + " • Pref Time: " + dto.getPreferredTime(),
                "CALL_REQUEST", "/admin/dispatch");

        return saved;
    }

    public List<CallRequest> getAllRequests() {
        return callRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<CallRequest> getCustomerRequests(Long customerId) {
        return callRequestRepository.findByCustomerId(customerId);
    }

    public CallRequest updateStatus(Long id, CallRequest.Status status, String admin) {
        CallRequest req = callRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Call request not found with id: " + id));
        req.setStatus(status);
        if (status == CallRequest.Status.CALLED || status == CallRequest.Status.RESOLVED) {
            req.setResolvedBy(admin != null ? admin : "Team");
            req.setResolvedAt(LocalDateTime.now());
        }
        return callRequestRepository.save(req);
    }
}
