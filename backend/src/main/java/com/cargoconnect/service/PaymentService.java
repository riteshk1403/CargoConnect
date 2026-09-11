package com.cargoconnect.service;

import com.cargoconnect.exception.BadRequestException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.Customer;
import com.cargoconnect.model.Payment;
import com.cargoconnect.model.Payment.PaymentMethod;
import com.cargoconnect.model.Payment.Status;
import com.cargoconnect.repository.CustomerRepository;
import com.cargoconnect.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment processPaymentInit(Long shipmentId, Double amount, PaymentMethod method, Long customerId) {
        Status status = Status.PENDING;
        String transactionId = null;

        if (method == PaymentMethod.CORPORATE_CREDIT) {
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

            if (!customer.isCorporate()) {
                throw new BadRequestException("Customer is not registered as a corporate account for credit billing");
            }

            double currentBal = customer.getOutstandingBalance() != null ? customer.getOutstandingBalance() : 0.0;
            double limit = customer.getCreditLimit() != null ? customer.getCreditLimit() : 0.0;
            double potentialBalance = currentBal + (amount != null ? amount : 0.0);

            if (potentialBalance > limit) {
                throw new BadRequestException("Corporate credit limit exceeded. Outstanding: $" +
                        String.format("%.2f", currentBal) + ", Limit: $" + String.format("%.2f", limit) +
                        " (Adding $" + String.format("%.2f", amount) + " would total $" + String.format("%.2f", potentialBalance) + ")");
            }

            customer.setOutstandingBalance(potentialBalance);
            customerRepository.save(customer);

            status = Status.PAID;
            transactionId = "TXN-CRED-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        Payment payment = Payment.builder()
                .shipmentId(shipmentId)
                .amount(amount)
                .paymentMethod(method)
                .status(status)
                .transactionId(transactionId)
                .invoiceDate(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    public Payment processOnlinePaymentSuccess(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found with id: " + paymentId));

        payment.setStatus(Status.PAID);
        payment.setTransactionId("TXN-ONL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return paymentRepository.save(payment);
    }

    public Payment processPaymentRefund(Long shipmentId, Double refundAmount) {
        Payment payment = paymentRepository.findByShipmentId(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for shipment id: " + shipmentId));

        payment.setStatus(Status.REFUNDED);
        double amt = payment.getAmount() != null ? payment.getAmount() : 0.0;
        double ref = refundAmount != null ? refundAmount : 0.0;
        payment.setAmount(Math.max(0.0, amt - ref));
        return paymentRepository.save(payment);
    }
}
