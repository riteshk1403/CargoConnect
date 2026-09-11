package com.cargoconnect.service;

import com.cargoconnect.dto.BookingRequest;
import com.cargoconnect.entity.*;
import com.cargoconnect.exception.ApiException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.repository.BookingRepository;
import com.cargoconnect.repository.DriverRepository;
import com.cargoconnect.repository.UserRepository;
import com.cargoconnect.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final PricingService pricingService;

    public BookingService(BookingRepository bookingRepository,
                         UserRepository userRepository,
                         DriverRepository driverRepository,
                         VehicleRepository vehicleRepository,
                         PricingService pricingService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.pricingService = pricingService;
    }

    public Booking createBooking(BookingRequest request) {
        if (request.getPickupDate().isAfter(request.getDeliveryDate())) {
            throw new ApiException("Pickup date must be before delivery date");
        }

        User shipper = userRepository.findById(request.getShipperId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipper not found"));

        Booking booking = new Booking();
        booking.setShipper(shipper);
        booking.setPickupAddress(request.getPickupAddress());
        booking.setDeliveryAddress(request.getDeliveryAddress());
        booking.setSenderName(request.getSenderName());
        booking.setSenderPhone(request.getSenderPhone());
        booking.setReceiverName(request.getReceiverName());
        booking.setReceiverPhone(request.getReceiverPhone());
        booking.setPackageType(request.getPackageType());
        booking.setPackageWeight(request.getPackageWeight());
        booking.setPackageDescription(request.getPackageDescription());
        booking.setBookingDate(LocalDate.now());
        booking.setPickupDate(request.getPickupDate());
        booking.setDeliveryDate(request.getDeliveryDate());

        VehicleType vehicleType = request.getVehicleType() == null ? VehicleType.MINI_TRUCK : VehicleType.valueOf(request.getVehicleType().toUpperCase());
        BookingStatus status = request.getEstimatedPrice() != null ? BookingStatus.PENDING : BookingStatus.PENDING;
        booking.setStatus(status);

        booking.setPrice(request.getEstimatedPrice() != null ? request.getEstimatedPrice() : pricingService.calculateEstimatedPrice(50.0, request.getPackageWeight(), vehicleType));
        booking.setPaymentStatus(PaymentStatus.PENDING);

        booking.setBookingNumber("CC-" + LocalDate.now().getYear() + "-" + String.format("%06d", bookingRepository.count() + 1));

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<Booking> getBookingsByShipper(Long shipperId) {
        User shipper = userRepository.findById(shipperId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipper not found with id: " + shipperId));
        return bookingRepository.findByShipper(shipper);
    }

    public List<Booking> getBookingsByDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        return bookingRepository.findByDriver(driver);
    }

    public Booking updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking assignDriver(Long bookingId, Long driverId) {
        Booking booking = getBookingById(bookingId);
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));

        booking.setDriver(driver);
        booking.setVehicle(driver.getVehicle());
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    public Booking getBookingByNumber(String bookingNumber) {
        return bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with number: " + bookingNumber));
    }

    public BigDecimal calculateEstimatedPrice(Long shipperId, Double weight, String vehicleType) {
        User shipper = userRepository.findById(shipperId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipper not found with id: " + shipperId));
        VehicleType type = VehicleType.valueOf(vehicleType.toUpperCase());
        return pricingService.calculateEstimatedPrice(40.0, weight, type);
    }
}
