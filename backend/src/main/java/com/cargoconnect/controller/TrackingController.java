package com.cargoconnect.controller;

import com.cargoconnect.dto.ApiResponse;
import com.cargoconnect.model.Shipment;
import com.cargoconnect.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TrackingController {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @GetMapping("/tracking/{shipmentIdentifier}")
    public ResponseEntity<ApiResponse> getTracking(@PathVariable String shipmentIdentifier) {
        Shipment shipment = shipmentRepository.findByShipmentId(shipmentIdentifier)
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(shipmentIdentifier);
                        return shipmentRepository.findById(id).orElse(null);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                });

        if (shipment == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Shipment not found with identifier: " + shipmentIdentifier, null));
        }

        List<String> timeline = new ArrayList<>();
        timeline.add("Shipment Created");
        if (shipment.getConfirmedPartnerId() != null) timeline.add("Cargo Partner Assigned");
        if (shipment.getAssignedDriverId() != null) timeline.add("Driver Dispatched");
        if (shipment.getStatus() == Shipment.Status.IN_TRANSIT || shipment.getStatus() == Shipment.Status.OUT_FOR_DELIVERY || shipment.getStatus() == Shipment.Status.DELIVERED) {
            timeline.add("In Transit");
        }
        if (shipment.getStatus() == Shipment.Status.OUT_FOR_DELIVERY || shipment.getStatus() == Shipment.Status.DELIVERED) {
            timeline.add("Out for Delivery");
        }
        if (shipment.getStatus() == Shipment.Status.DELIVERED) {
            timeline.add("Delivered");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("shipmentId", shipment.getShipmentId());
        payload.put("status", shipment.getStatus());
        payload.put("fareStatus", shipment.getFareStatus());
        payload.put("pickupAddress", shipment.getPickupAddress());
        payload.put("deliveryAddress", shipment.getDeliveryAddress());
        payload.put("currentLocation", shipment.getStatus() == Shipment.Status.DELIVERED ? shipment.getDeliveryAddress() : shipment.getPickupAddress());
        payload.put("timeline", timeline);
        payload.put("assignedDriverId", shipment.getAssignedDriverId());
        payload.put("assignedVehicleId", shipment.getAssignedVehicleId());

        return ResponseEntity.ok(new ApiResponse(true, "Tracking data fetched successfully", payload));
    }
}
