package com.cargoconnect.controller;

import com.cargoconnect.dto.ApiResponse;
import com.cargoconnect.dto.BookingRequest;
import com.cargoconnect.entity.Booking;
import com.cargoconnect.entity.BookingStatus;
import com.cargoconnect.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(new ApiResponse(true, "Booking created successfully", booking));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(new ApiResponse(true, "Bookings fetched successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Booking fetched successfully", booking));
    }

    @GetMapping("/shipper/{shipperId}")
    public ResponseEntity<ApiResponse> getBookingsByShipper(@PathVariable Long shipperId) {
        List<Booking> bookings = bookingService.getBookingsByShipper(shipperId);
        return ResponseEntity.ok(new ApiResponse(true, "Shipper bookings fetched successfully", bookings));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse> getBookingsByDriver(@PathVariable Long driverId) {
        List<Booking> bookings = bookingService.getBookingsByDriver(driverId);
        return ResponseEntity.ok(new ApiResponse(true, "Driver bookings fetched successfully", bookings));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        Booking booking = bookingService.updateStatus(id, bookingStatus);
        return ResponseEntity.ok(new ApiResponse(true, "Booking status updated successfully", booking));
    }

    @PutMapping("/{id}/assign-driver/{driverId}")
    public ResponseEntity<ApiResponse> assignDriver(@PathVariable Long id, @PathVariable Long driverId) {
        Booking booking = bookingService.assignDriver(id, driverId);
        return ResponseEntity.ok(new ApiResponse(true, "Driver assigned successfully", booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(new ApiResponse(true, "Booking deleted successfully", null));
    }
}
