package com.cargoconnect.repository;

import com.cargoconnect.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintId(String complaintId);
    List<Complaint> findByCustomerId(Long customerId);
    List<Complaint> findByShipmentId(Long shipmentId);
    List<Complaint> findByStatus(Complaint.Status status);
}
