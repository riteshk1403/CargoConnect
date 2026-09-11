package com.cargoconnect.repository;

import com.cargoconnect.model.CommissionSettlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommissionSettlementRepository extends JpaRepository<CommissionSettlement, Long> {

    Optional<CommissionSettlement> findByShipmentId(Long shipmentId);

    Optional<CommissionSettlement> findByPaymentOrderId(String paymentOrderId);

    Optional<CommissionSettlement> findByRazorpayPaymentId(String razorpayPaymentId);

    List<CommissionSettlement> findByCargoPartnerId(Long cargoPartnerId);

    List<CommissionSettlement> findByCargoPartnerIdAndPaymentStatus(
            Long cargoPartnerId, CommissionSettlement.PaymentStatus paymentStatus);

    List<CommissionSettlement> findByCargoPartnerIdOrderByCreatedAtDesc(Long cargoPartnerId);

    List<CommissionSettlement> findAllByOrderByCreatedAtDesc();

    boolean existsByCargoPartnerIdAndPaymentStatusIn(
            Long cargoPartnerId, List<CommissionSettlement.PaymentStatus> statuses);

    @Query("SELECT COUNT(cs) FROM CommissionSettlement cs WHERE cs.cargoPartnerId = :partnerId AND cs.paymentStatus IN ('PENDING', 'PAYMENT_INITIATED')")
    long countUnpaidSettlementsByPartnerId(@Param("partnerId") Long partnerId);

    @Query("SELECT COALESCE(SUM(cs.commissionAmount), 0.0) FROM CommissionSettlement cs WHERE cs.cargoPartnerId = :partnerId AND cs.paymentStatus IN ('PENDING', 'PAYMENT_INITIATED')")
    Double sumPendingCommissionByPartnerId(@Param("partnerId") Long partnerId);
}
