package com.cargoconnect.repository;

import com.cargoconnect.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByShipmentId(Long shipmentId);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByCustomerId(Long customerId);
}
