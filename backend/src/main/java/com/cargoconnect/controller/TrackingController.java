package com.cargoconnect.controller;

import com.cargoconnect.dto.ApiResponse;
import com.cargoconnect.entity.Booking;
import com.cargoconnect.entity.BookingStatus;
import com.cargoconnect.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TrackingController {

    private final BookingService bookingService;

    public TrackingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/tracking/{bookingNumber}")
    public ResponseEntity<ApiResponse> getTracking(@PathVariable String bookingNumber) {
        Booking booking = bookingService.getBookingByNumber(bookingNumber);

        List<String> timeline = new ArrayList<>();
        timeline.add("Booking Created");
        if (booking.getDriver() != null) timeline.add("Driver Assigned");
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
            timeline.add("Package Picked Up");
        }
        if (booking.getStatus() == BookingStatus.IN_TRANSIT || booking.getStatus() == BookingStatus.OUT_FOR_DELIVERY || booking.getStatus() == BookingStatus.DELIVERED) {
            timeline.add("In Transit");
        }
        if (booking.getStatus() == BookingStatus.OUT_FOR_DELIVERY || booking.getStatus() == BookingStatus.DELIVERED) {
            timeline.add("Out for Delivery");
        }
        if (booking.getStatus() == BookingStatus.DELIVERED) {
            timeline.add("Delivered");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("bookingNumber", booking.getBookingNumber());
        payload.put("status", booking.getStatus());
        payload.put("timeline", timeline);
        payload.put("pickupAddress", booking.getPickupAddress());
        payload.put("deliveryAddress", booking.getDeliveryAddress());

        return ResponseEntity.ok(new ApiResponse(true, "Tracking data fetched successfully", payload));
    }
}
