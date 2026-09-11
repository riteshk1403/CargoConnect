package com.cargoconnect;

import com.cargoconnect.dto.*;
import com.cargoconnect.exception.*;
import com.cargoconnect.model.*;
import com.cargoconnect.repository.*;
import com.cargoconnect.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuthSecurityTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("PasswordValidator strictly checks for length, uppercase, lowercase, digit, and special characters")
    void testPasswordValidatorRules() {
        assertTrue(PasswordValidator.isValid("Cargo@123"));
        assertTrue(PasswordValidator.isValid("Secure#2026"));
        assertTrue(PasswordValidator.isValid("P@ssw0rd"));

        // Invalid: missing special char
        assertFalse(PasswordValidator.isValid("Cargo123"));
        // Invalid: missing uppercase
        assertFalse(PasswordValidator.isValid("cargo@123"));
        // Invalid: missing number
        assertFalse(PasswordValidator.isValid("Cargo@abc"));
        // Invalid: too short
        assertFalse(PasswordValidator.isValid("C@1a"));
        // Invalid: null
        assertFalse(PasswordValidator.isValid(null));
    }

    @Test
    @DisplayName("User registration hashes password with BCrypt and generates 6-digit verification OTP")
    void testRegistrationSecurity() {
        SignupRequest request = SignupRequest.builder()
                .username("newshipper_test")
                .email("newshipper@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .name("New Shipper")
                .build();

        AuthResponse response = authService.registerUser(request);

        assertNotNull(response);
        assertFalse(response.isEmailVerified());
        assertNull(response.getToken(), "Token should not be issued to unverified user");

        User savedUser = userRepository.findByEmail("newshipper@testcorp.com").orElse(null);
        assertNotNull(savedUser);
        assertNotEquals("Cargo@123", savedUser.getPassword(), "Raw password must NEVER be stored");
        assertTrue(passwordEncoder.matches("Cargo@123", savedUser.getPassword()), "BCrypt hash must match");
        assertNotNull(savedUser.getVerificationOtp());
        assertEquals(6, savedUser.getVerificationOtp().length(), "OTP must be 6 digits");
        assertNotNull(savedUser.getVerificationOtpExpiry());
        assertTrue(savedUser.getVerificationOtpExpiry().isAfter(LocalDateTime.now()));
    }

    @Test
    @DisplayName("Duplicate email during registration throws DuplicateEmailException (409 Conflict)")
    void testDuplicateEmailHandling() {
        SignupRequest request1 = SignupRequest.builder()
                .username("user_one")
                .email("duplicate@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .build();
        authService.registerUser(request1);

        SignupRequest request2 = SignupRequest.builder()
                .username("user_two")
                .email("duplicate@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .build();

        assertThrows(DuplicateEmailException.class, () -> {
            authService.registerUser(request2);
        });
    }

    @Test
    @DisplayName("Weak password during registration throws BadRequestException")
    void testWeakPasswordRejection() {
        SignupRequest request = SignupRequest.builder()
                .username("weak_user")
                .email("weak@testcorp.com")
                .password("weak123")
                .role("ROLE_SHIPPER")
                .build();

        assertThrows(BadRequestException.class, () -> {
            authService.registerUser(request);
        });
    }

    @Test
    @DisplayName("Unverified user cannot log in and throws UnverifiedUserException")
    void testUnverifiedUserLoginGate() {
        SignupRequest reg = SignupRequest.builder()
                .username("gate_user")
                .email("gate@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .build();
        authService.registerUser(reg);

        LoginRequest login = LoginRequest.builder()
                .username("gate_user")
                .password("Cargo@123")
                .build();

        assertThrows(UnverifiedUserException.class, () -> {
            authService.authenticateUser(login);
        });
    }

    @Test
    @DisplayName("6-digit OTP verification activates account and enables login")
    void testOtpVerificationAndLogin() {
        SignupRequest reg = SignupRequest.builder()
                .username("verified_shipper")
                .email("verified@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .build();
        authService.registerUser(reg);

        User user = userRepository.findByEmail("verified@testcorp.com").orElseThrow();
        String correctOtp = user.getVerificationOtp();

        // Verify with correct OTP
        VerifyOtpRequest verifyReq = VerifyOtpRequest.builder()
                .email("verified@testcorp.com")
                .otp(correctOtp)
                .build();
        AuthResponse verifyRes = authService.verifyOtp(verifyReq);
        assertTrue(verifyRes.isEmailVerified());

        User verifiedUser = userRepository.findByEmail("verified@testcorp.com").orElseThrow();
        assertTrue(verifiedUser.isEmailVerified());
        assertNull(verifiedUser.getVerificationOtp());
        assertNull(verifiedUser.getVerificationOtpExpiry());

        // Now login succeeds
        LoginRequest login = LoginRequest.builder()
                .username("verified_shipper")
                .password("Cargo@123")
                .build();
        AuthResponse loginRes = authService.authenticateUser(login);
        assertNotNull(loginRes.getToken());
        assertEquals("ROLE_SHIPPER", loginRes.getRole());
    }

    @Test
    @DisplayName("Invalid OTP increments attempt count and throws InvalidOtpException")
    void testInvalidOtpAttempts() {
        SignupRequest reg = SignupRequest.builder()
                .username("attempt_user")
                .email("attempt@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .build();
        authService.registerUser(reg);

        VerifyOtpRequest badOtp = VerifyOtpRequest.builder()
                .email("attempt@testcorp.com")
                .otp("000000")
                .build();

        assertThrows(InvalidOtpException.class, () -> {
            authService.verifyOtp(badOtp);
        });

        User user = userRepository.findByEmail("attempt@testcorp.com").orElseThrow();
        assertEquals(1, user.getOtpAttemptCount());
    }

    @Test
    @DisplayName("Resending OTP before 60 seconds triggers OtpRateLimitException (429)")
    void testOtpRateLimitCooldown() {
        SignupRequest reg = SignupRequest.builder()
                .username("cooldown_user")
                .email("cooldown@testcorp.com")
                .password("Cargo@123")
                .role("ROLE_SHIPPER")
                .build();
        authService.registerUser(reg);

        ResendOtpRequest resendReq = ResendOtpRequest.builder()
                .email("cooldown@testcorp.com")
                .build();

        // Immediately requesting resend should be blocked by 60s cooldown
        assertThrows(OtpRateLimitException.class, () -> {
            authService.resendOtp(resendReq);
        });
    }

    @Test
    @DisplayName("Forgot Password and Reset Password workflow with strong password rules")
    void testForgotPasswordAndResetWorkflow() {
        SignupRequest reg = SignupRequest.builder()
                .username("reset_user")
                .email("reset@testcorp.com")
                .password("OldPass@123")
                .role("ROLE_SHIPPER")
                .build();
        authService.registerUser(reg);

        // Verify account first
        User user = userRepository.findByEmail("reset@testcorp.com").orElseThrow();
        user.setEmailVerified(true);
        userRepository.save(user);

        // Request Password Reset
        ForgotPasswordRequest forgotReq = ForgotPasswordRequest.builder()
                .email("reset@testcorp.com")
                .build();
        authService.forgotPassword(forgotReq);

        User resetUser = userRepository.findByEmail("reset@testcorp.com").orElseThrow();
        String resetOtp = resetUser.getPasswordResetOtp();
        assertNotNull(resetOtp);
        assertEquals(6, resetOtp.length());

        // Reset Password with new strong password
        ResetPasswordRequest resetReq = ResetPasswordRequest.builder()
                .email("reset@testcorp.com")
                .otp(resetOtp)
                .newPassword("NewPass@456")
                .build();
        AuthResponse resetRes = authService.resetPassword(resetReq);
        assertNotNull(resetRes);

        // Old password fails
        LoginRequest oldLogin = LoginRequest.builder()
                .username("reset_user")
                .password("OldPass@123")
                .build();
        assertThrows(BadCredentialsException.class, () -> {
            authService.authenticateUser(oldLogin);
        });

        // New password succeeds
        LoginRequest newLogin = LoginRequest.builder()
                .username("reset_user")
                .password("NewPass@456")
                .build();
        AuthResponse loginRes = authService.authenticateUser(newLogin);
        assertNotNull(loginRes.getToken());
    }
}
