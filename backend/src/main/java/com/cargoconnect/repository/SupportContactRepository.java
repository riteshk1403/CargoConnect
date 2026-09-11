package com.cargoconnect.repository;

import com.cargoconnect.model.SupportContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupportContactRepository extends JpaRepository<SupportContact, Long> {

    List<SupportContact> findByIsActiveTrueOrderByDisplayOrderAscIdAsc();

    List<SupportContact> findAllByOrderByDisplayOrderAscIdAsc();

    long countByIsActiveTrue();

    Optional<SupportContact> findByPhoneNumber(String phoneNumber);
}
