package com.cargoconnect.controller;

import com.cargoconnect.dto.DriverRatingRequest;
import com.cargoconnect.model.DriverRating;
import com.cargoconnect.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<DriverRating> rateDriver(@Valid @RequestBody DriverRatingRequest request, Authentication auth) {
        String username = auth != null ? auth.getName() : "shipper";
        // Customer ID can be resolved from context or null
        return ResponseEntity.ok(ratingService.rateDriver(request, null, username));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<DriverRating>> getRatingsForDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(ratingService.getRatingsForDriver(driverId));
    }
}
