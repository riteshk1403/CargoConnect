package com.cargoconnect.service;

import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.model.CargoPartner;
import com.cargoconnect.model.Customer;
import com.cargoconnect.model.Invoice;
import com.cargoconnect.model.Payment;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.repository.CargoPartnerRepository;
import com.cargoconnect.repository.CustomerRepository;
import com.cargoconnect.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    public Invoice generateInvoice(Shipment shipment) {
        return generateInvoice(shipment, null);
    }

    public Invoice generateInvoice(Shipment shipment, Payment payment) {
        Optional<Invoice> existing = invoiceRepository.findByShipmentId(shipment.getId());
        if (existing.isPresent()) {
            Invoice inv = existing.get();
            if (payment != null && payment.getStatus() != null) {
                inv.setPaymentStatus(payment.getStatus().name());
            }
            return invoiceRepository.save(inv);
        }

        String customerName = "Valued Customer";
        if (shipment.getCustomerId() != null) {
            Customer cust = customerRepository.findById(shipment.getCustomerId()).orElse(null);
            if (cust != null) {
                customerName = cust.getName() + (cust.getCompanyName() != null ? " (" + cust.getCompanyName() + ")" : "");
            }
        }

        String partnerName = "Assigned Cargo Partner";
        if (shipment.getConfirmedPartnerId() != null) {
            CargoPartner partner = cargoPartnerRepository.findById(shipment.getConfirmedPartnerId()).orElse(null);
            if (partner != null) {
                partnerName = partner.getCompanyName();
            }
        }

        double fare = shipment.getFare() != null ? shipment.getFare() : (shipment.getPrice() != null ? shipment.getPrice() : 0.0);
        double commRate = shipment.getCommissionRate() != null ? shipment.getCommissionRate() : 10.0;
        double commAmount = shipment.getCommissionAmount() != null ? shipment.getCommissionAmount() : (fare * (commRate / 100.0));
        double partnerAmount = shipment.getPartnerAmount() != null ? shipment.getPartnerAmount() : (fare - commAmount);

        Invoice invoice = Invoice.builder()
                .invoiceNumber("INV-" + shipment.getShipmentId())
                .shipmentId(shipment.getId())
                .customerId(shipment.getCustomerId())
                .customerName(customerName)
                .cargoPartnerId(shipment.getConfirmedPartnerId())
                .cargoPartnerName(partnerName)
                .pickupAddress(shipment.getPickupAddress())
                .deliveryAddress(shipment.getDeliveryAddress())
                .cargoType(shipment.getGoodsType())
                .weight(shipment.getWeight())
                .serviceType(shipment.getServiceType() != null ? shipment.getServiceType().name() : "NORMAL")
                .fare(fare)
                .commissionRate(commRate)
                .commissionAmount(commAmount)
                .partnerAmount(partnerAmount)
                .totalAmount(fare)
                .paymentStatus(payment != null && payment.getStatus() != null ? payment.getStatus().name() : "PAID")
                .invoiceDate(LocalDateTime.now())
                .build();

        return invoiceRepository.save(invoice);
    }

    public Invoice getInvoiceByShipmentId(Long shipmentId) {
        return invoiceRepository.findByShipmentId(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found for shipment id: " + shipmentId));
    }

    public List<Invoice> getInvoicesByCustomerId(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
