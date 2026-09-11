package com.cargoconnect.service;

import com.cargoconnect.dto.RazorpayOrderResponseDto;
import com.cargoconnect.dto.RazorpayVerifyRequest;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ConflictException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.CargoPartner;
import com.cargoconnect.model.CommissionSettlement;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.repository.CargoPartnerRepository;
import com.cargoconnect.repository.CommissionSettlementRepository;
import com.cargoconnect.repository.ShipmentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommissionSettlementService {

    @Autowired
    private CommissionSettlementRepository settlementRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 1. Create or ensure Settlement exists for confirmed shipment
    @Transactional
    public CommissionSettlement createSettlementForShipment(Shipment shipment, Long partnerId) {
        if (shipment == null || partnerId == null) {
            return null;
        }

        Optional<CommissionSettlement> existing = settlementRepository.findByShipmentId(shipment.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        CargoPartner partner = cargoPartnerRepository.findById(partnerId).orElse(null);
        String partnerName = partner != null ? partner.getCompanyName() : "Partner #" + partnerId;

        double fare = shipment.getFare() != null ? shipment.getFare() : (shipment.getPrice() != null ? shipment.getPrice() : 0.0);
        double commRate = shipment.getCommissionRate() != null ? shipment.getCommissionRate() : 10.0;
        double commAmount = shipment.getCommissionAmount() != null ? shipment.getCommissionAmount() : Math.round((fare * (commRate / 100.0)) * 100.0) / 100.0;
        double partnerAmount = shipment.getPartnerAmount() != null ? shipment.getPartnerAmount() : Math.round((fare - commAmount) * 100.0) / 100.0;

        CommissionSettlement settlement = CommissionSettlement.builder()
                .shipmentId(shipment.getId())
                .shipmentNumber(shipment.getShipmentId())
                .cargoPartnerId(partnerId)
                .cargoPartnerName(partnerName)
                .shipmentFare(fare)
                .commissionRate(commRate)
                .commissionAmount(commAmount)
                .partnerAmount(partnerAmount)
                .paymentStatus(CommissionSettlement.PaymentStatus.PENDING)
                .build();

        CommissionSettlement saved = settlementRepository.save(settlement);

        auditLogService.log(partnerName, "ROLE_CARGO_PARTNER",
                "COMMISSION_CREATED", "COMMISSION_SETTLEMENT", String.valueOf(saved.getId()),
                "Commission settlement generated for " + shipment.getShipmentId() + ": ₹" + commAmount + " (" + commRate + "%)");

        return saved;
    }

    // 2. Query Pending Settlements for a Partner
    public List<CommissionSettlement> getPendingSettlementsForPartner(Long partnerId) {
        return settlementRepository.findByCargoPartnerIdAndPaymentStatus(partnerId, CommissionSettlement.PaymentStatus.PENDING);
    }

    // 3. Query All Settlements for a Partner
    public List<CommissionSettlement> getAllSettlementsForPartner(Long partnerId) {
        return settlementRepository.findByCargoPartnerIdOrderByCreatedAtDesc(partnerId);
    }

    // 4. Query All Settlements for Admin View
    public List<CommissionSettlement> getAllSettlementsForAdmin() {
        return settlementRepository.findAllByOrderByCreatedAtDesc();
    }

    // 5. Create Razorpay Order for Commission Payment
    @Transactional
    public RazorpayOrderResponseDto createRazorpayOrder(Long settlementId, Long partnerId) {
        CommissionSettlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission settlement not found with id: " + settlementId));

        if (partnerId != null && !partnerId.equals(settlement.getCargoPartnerId())) {
            throw new BadRequestException("This commission settlement does not belong to your partner account.");
        }

        if (settlement.getPaymentStatus() == CommissionSettlement.PaymentStatus.PAID) {
            throw new ConflictException("This commission has already been paid.");
        }

        long amountInPaise = Math.round(settlement.getCommissionAmount() * 100);
        String currency = "INR";
        String receipt = "comm_" + settlement.getId();

        String orderId = razorpayService.createOrder(amountInPaise, currency, receipt);

        settlement.setPaymentOrderId(orderId);
        settlement.setPaymentStatus(CommissionSettlement.PaymentStatus.PAYMENT_INITIATED);
        settlementRepository.save(settlement);

        CargoPartner partner = cargoPartnerRepository.findById(settlement.getCargoPartnerId()).orElse(null);

        auditLogService.log(partner != null ? partner.getCompanyName() : "Partner #" + settlement.getCargoPartnerId(),
                "ROLE_CARGO_PARTNER", "COMMISSION_PAYMENT_INITIATED", "COMMISSION_SETTLEMENT", String.valueOf(settlement.getId()),
                "Razorpay order initialized: " + orderId + " for amount ₹" + settlement.getCommissionAmount());

        return RazorpayOrderResponseDto.builder()
                .settlementId(settlement.getId())
                .orderId(orderId)
                .amountInPaise(amountInPaise)
                .amountInRupees(settlement.getCommissionAmount())
                .currency(currency)
                .keyId(razorpayService.getKeyId())
                .shipmentNumber(settlement.getShipmentNumber())
                .partnerCompanyName(partner != null ? partner.getCompanyName() : "Cargo Partner")
                .partnerEmail(partner != null ? partner.getEmail() : "")
                .partnerPhone(partner != null ? partner.getPhone() : "")
                .isLiveRazorpayOrder(!orderId.startsWith("sim_order_"))
                .build();
    }

    // 6. Verify Razorpay Payment Signature and Mark PAID
    @Transactional
    public CommissionSettlement verifyRazorpayPayment(RazorpayVerifyRequest request, Long partnerId) {
        CommissionSettlement settlement = settlementRepository.findById(request.getSettlementId())
                .orElseThrow(() -> new ResourceNotFoundException("Commission settlement not found with id: " + request.getSettlementId()));

        if (partnerId != null && !partnerId.equals(settlement.getCargoPartnerId())) {
            throw new BadRequestException("This commission settlement does not belong to your partner account.");
        }

        if (settlement.getPaymentStatus() == CommissionSettlement.PaymentStatus.PAID) {
            return settlement; // Idempotent: already paid
        }

        boolean isValid = razorpayService.verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            settlement.setPaymentStatus(CommissionSettlement.PaymentStatus.FAILED);
            settlementRepository.save(settlement);
            auditLogService.log("Razorpay Gateway", "ROLE_CARGO_PARTNER",
                    "COMMISSION_PAYMENT_FAILED", "COMMISSION_SETTLEMENT", String.valueOf(settlement.getId()),
                    "Invalid signature verification for order: " + request.getRazorpayOrderId());
            throw new BadRequestException("Payment verification failed. Invalid digital signature.");
        }

        settlement.setPaymentStatus(CommissionSettlement.PaymentStatus.PAID);
        settlement.setRazorpayPaymentId(request.getRazorpayPaymentId());
        settlement.setRazorpaySignature(request.getRazorpaySignature());
        settlement.setPaidAt(LocalDateTime.now());
        CommissionSettlement saved = settlementRepository.save(settlement);

        CargoPartner partner = cargoPartnerRepository.findById(saved.getCargoPartnerId()).orElse(null);
        String partnerName = partner != null ? partner.getCompanyName() : "Partner #" + saved.getCargoPartnerId();

        // In-app notifications
        notificationService.sendNotification(null, "ROLE_CARGO_PARTNER",
                "✅ Commission Payment Successful — " + saved.getShipmentNumber(),
                "Payment of ₹" + saved.getCommissionAmount() + " received. You are now ELIGIBLE for new shipment broadcasts.",
                "COMMISSION_PAID", "/partner/dashboard");

        notificationService.sendNotification(null, "ROLE_ADMIN",
                "Commission Received — ₹" + saved.getCommissionAmount(),
                partnerName + " paid platform commission for shipment " + saved.getShipmentNumber() + " (Payment ID: " + saved.getRazorpayPaymentId() + ")",
                "COMMISSION_RECEIVED", "/admin/dashboard");

        auditLogService.log(partnerName, "ROLE_CARGO_PARTNER",
                "COMMISSION_PAID", "COMMISSION_SETTLEMENT", String.valueOf(saved.getId()),
                "Commission paid ₹" + saved.getCommissionAmount() + " via Razorpay (" + saved.getRazorpayPaymentId() + "). Eligibility unlocked.");

        return saved;
    }

    // 7. Razorpay Webhook Handler (Idempotent)
    @Transactional
    public boolean handleRazorpayWebhook(String payload, String signature) {
        if (!razorpayService.verifyWebhookSignature(payload, signature)) {
            throw new BadRequestException("Invalid Razorpay webhook signature.");
        }

        try {
            JsonNode root = objectMapper.readTree(payload);
            String event = root.path("event").asText("");

            if ("payment.captured".equals(event) || "order.paid".equals(event)) {
                JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
                String orderId = paymentEntity.path("order_id").asText();
                String paymentId = paymentEntity.path("id").asText();

                if (orderId != null && !orderId.isEmpty()) {
                    Optional<CommissionSettlement> opt = settlementRepository.findByPaymentOrderId(orderId);
                    if (opt.isPresent()) {
                        CommissionSettlement settlement = opt.get();
                        if (settlement.getPaymentStatus() == CommissionSettlement.PaymentStatus.PAID) {
                            return true; // Already processed idempotently
                        }
                        settlement.setPaymentStatus(CommissionSettlement.PaymentStatus.PAID);
                        settlement.setRazorpayPaymentId(paymentId);
                        settlement.setPaidAt(LocalDateTime.now());
                        settlementRepository.save(settlement);

                        auditLogService.log("Razorpay Webhook", "SYSTEM",
                                "COMMISSION_WEBHOOK_PROCESSED", "COMMISSION_SETTLEMENT", String.valueOf(settlement.getId()),
                                "Payment confirmed via Webhook: " + paymentId);
                        return true;
                    }
                }
            }
            return true;
        } catch (Exception e) {
            throw new BadRequestException("Error processing Razorpay webhook payload: " + e.getMessage());
        }
    }

    // 8. Gate Check: Is Partner Eligible for New Offers?
    public boolean isPartnerEligibleForNewOrders(Long partnerId) {
        if (partnerId == null) {
            return false;
        }
        long unpaidCount = settlementRepository.countUnpaidSettlementsByPartnerId(partnerId);
        return unpaidCount == 0;
    }

    public Double getPendingCommissionAmountForPartner(Long partnerId) {
        if (partnerId == null) return 0.0;
        return settlementRepository.sumPendingCommissionByPartnerId(partnerId);
    }
}
