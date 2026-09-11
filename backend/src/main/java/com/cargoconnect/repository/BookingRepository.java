package com.cargoconnect.repository;

import com.cargoconnect.entity.Booking;
import com.cargoconnect.entity.BookingStatus;
import com.cargoconnect.entity.Driver;
import com.cargoconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByShipper(User shipper);
    List<Booking> findByDriver(Driver driver);
    Optional<Booking> findByBookingNumber(String bookingNumber);
    long countByStatus(BookingStatus status);
}
