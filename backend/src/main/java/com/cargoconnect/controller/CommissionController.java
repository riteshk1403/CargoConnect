package com.cargoconnect.controller;

import com.cargoconnect.dto.RazorpayOrderResponseDto;
import com.cargoconnect.dto.RazorpayVerifyRequest;
import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.model.CommissionSetting;
import com.cargoconnect.model.CommissionSettlement;
import com.cargoconnect.model.User;
import com.cargoconnect.repository.UserRepository;
import com.cargoconnect.service.CommissionService;
import com.cargoconnect.service.CommissionSettlementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class CommissionController {

    @Autowired
    private CommissionSettlementService commissionSettlementService;

    @Autowired
    private CommissionService commissionService;

    @Autowired
    private UserRepository userRepository;

    // Helper: Extract CargoPartnerId from Authenticated User
    private Long extractPartnerId(Authentication auth) {
        if (auth == null) return null;
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user != null) {
            return user.getCargoPartnerId();
        }
        return null;
    }

    // 1. Partner creates Razorpay Order for a settlement
    @PostMapping("/partner/commission/{settlementId}/create-order")
    @PreAuthorize("hasAnyRole('CARGO_PARTNER', 'ADMIN')")
    public ResponseEntity<RazorpayOrderResponseDto> createRazorpayOrder(
            @PathVariable Long settlementId,
            Authentication authentication) {
        Long partnerId = extractPartnerId(authentication);
        return ResponseEntity.ok(commissionSettlementService.createRazorpayOrder(settlementId, partnerId));
    }

    // 2. Partner verifies Razorpay Payment Signature
    @PostMapping("/payment/razorpay/verify")
    @PreAuthorize("hasAnyRole('CARGO_PARTNER', 'ADMIN')")
    public ResponseEntity<CommissionSettlement> verifyRazorpayPayment(
            @Valid @RequestBody RazorpayVerifyRequest request,
            Authentication authentication) {
        Long partnerId = extractPartnerId(authentication);
        return ResponseEntity.ok(commissionSettlementService.verifyRazorpayPayment(request, partnerId));
    }

    // 3. Razorpay Webhook Endpoint (PermitAll with HMAC validation)
    @PostMapping("/payment/razorpay/webhook")
    public ResponseEntity<Map<String, Object>> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        boolean processed = commissionSettlementService.handleRazorpayWebhook(payload, signature);
        return ResponseEntity.ok(Map.of("status", "ok", "processed", processed));
    }

    // 4. Partner views all their settlements
    @GetMapping("/partner/commissions")
    @PreAuthorize("hasAnyRole('CARGO_PARTNER', 'ADMIN')")
    public ResponseEntity<List<CommissionSettlement>> getPartnerCommissions(Authentication authentication) {
        Long partnerId = extractPartnerId(authentication);
        if (partnerId == null) {
            throw new BadRequestException("No cargo partner account linked to this user.");
        }
        return ResponseEntity.ok(commissionSettlementService.getAllSettlementsForPartner(partnerId));
    }

    // 5. Partner views pending settlements
    @GetMapping("/partner/commissions/pending")
    @PreAuthorize("hasAnyRole('CARGO_PARTNER', 'ADMIN')")
    public ResponseEntity<List<CommissionSettlement>> getPendingCommissions(Authentication authentication) {
        Long partnerId = extractPartnerId(authentication);
        if (partnerId == null) {
            throw new BadRequestException("No cargo partner account linked to this user.");
        }
        return ResponseEntity.ok(commissionSettlementService.getPendingSettlementsForPartner(partnerId));
    }

    // 6. Partner eligibility status check
    @GetMapping("/partner/payment-status")
    @PreAuthorize("hasAnyRole('CARGO_PARTNER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getPartnerPaymentStatus(Authentication authentication) {
        Long partnerId = extractPartnerId(authentication);
        boolean isEligible = commissionSettlementService.isPartnerEligibleForNewOrders(partnerId);
        Double pendingAmount = commissionSettlementService.getPendingCommissionAmountForPartner(partnerId);
        return ResponseEntity.ok(Map.of(
                "isEligibleForNewOrders", isEligible,
                "pendingCommissionAmount", pendingAmount
        ));
    }

    // 7. Admin views all settlements
    @GetMapping("/admin/commissions/settlements")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<CommissionSettlement>> getAllSettlementsForAdmin() {
        return ResponseEntity.ok(commissionSettlementService.getAllSettlementsForAdmin());
    }

    // 8. Admin / Authenticated views commission rate setting
    @GetMapping({"/commission", "/admin/commissions/settings"})
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CARGO_PARTNER', 'SHIPPER')")
    public ResponseEntity<CommissionSetting> getCommissionSettings() {
        return ResponseEntity.ok(commissionService.getCommissionSetting());
    }

    // 9. Admin updates commission rate setting (supports PUT and POST, /commission and /admin/commissions/settings)
    @RequestMapping(value = {"/commission", "/admin/commissions/settings"}, method = {RequestMethod.POST, RequestMethod.PUT})
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<CommissionSetting> updateCommissionRate(
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Double rate = null;
        if (body != null && body.containsKey("commissionRate")) {
            Object rawRate = body.get("commissionRate");
            if (rawRate instanceof Number num) {
                rate = num.doubleValue();
            } else if (rawRate != null) {
                try {
                    rate = Double.parseDouble(rawRate.toString());
                } catch (NumberFormatException ignored) {}
            }
        }
        if (rate == null) {
            throw new BadRequestException("Valid commissionRate is required");
        }
        String adminUser = authentication != null ? authentication.getName() : "admin";
        return ResponseEntity.ok(commissionService.updateCommissionRate(rate, adminUser));
    }
}
