package com.cargoconnect.controller;

import com.cargoconnect.dto.*;
import com.cargoconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return new ResponseEntity<>(authService.registerUser(signUpRequest), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyRequest) {
        return ResponseEntity.ok(authService.verifyOtp(verifyRequest));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@Valid @RequestBody ResendOtpRequest resendRequest) {
        return ResponseEntity.ok(authService.resendOtp(resendRequest));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotRequest) {
        return ResponseEntity.ok(authService.forgotPassword(forgotRequest));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest resetRequest) {
        return ResponseEntity.ok(authService.resetPassword(resetRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(authService.logoutUser(authHeader));
    }

    @GetMapping("/dev-otp")
    public ResponseEntity<java.util.Map<String, String>> getDevOtp(@RequestParam("email") String email) {
        return ResponseEntity.ok(authService.getDevOtp(email));
    }

    // Legacy verify-email and resend-verification endpoints
    @GetMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestParam("token") String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<AuthResponse> resendVerification(@RequestParam("email") String email) {
        return ResponseEntity.ok(authService.resendVerificationEmail(email));
    }
}
