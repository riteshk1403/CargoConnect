package com.cargoconnect.repository;

import com.cargoconnect.model.CallRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallRequestRepository extends JpaRepository<CallRequest, Long> {
    List<CallRequest> findByCustomerId(Long customerId);
    List<CallRequest> findByStatusOrderByCreatedAtDesc(CallRequest.Status status);
    List<CallRequest> findAllByOrderByCreatedAtDesc();
}
