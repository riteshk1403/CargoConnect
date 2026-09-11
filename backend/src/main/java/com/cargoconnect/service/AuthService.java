package com.cargoconnect.service;

import com.cargoconnect.config.JwtUtils;
import com.cargoconnect.dto.*;
import com.cargoconnect.exception.*;
import com.cargoconnect.model.*;
import com.cargoconnect.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CargoPartnerRepository cargoPartnerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditLogService auditLogService;

    private String generateSixDigitOtp() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

    @Transactional
    public AuthResponse registerUser(SignupRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String username = request.getUsername() != null ? request.getUsername().trim() : "";

        // 1. Validate Password Strength
        if (!PasswordValidator.isValid(request.getPassword())) {
            throw new BadRequestException(PasswordValidator.getRequirementsMessage());
        }

        // 2. Pre-check Duplicate Email
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("An account with this email already exists. Please login or use Forgot Password.");
        }

        // 3. Pre-check Duplicate Username
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username '" + username + "' is already taken. Please choose another username.");
        }

        Role userRole = Role.ROLE_SHIPPER;
        if (request.getRole() != null) {
            String r = request.getRole().toUpperCase();
            if (r.contains("ADMIN")) userRole = Role.ROLE_ADMIN;
            else if (r.contains("EMPLOYEE")) userRole = Role.ROLE_EMPLOYEE;
            else if (r.contains("PARTNER")) userRole = Role.ROLE_CARGO_PARTNER;
            else userRole = Role.ROLE_SHIPPER;
        }

        Long customerId = null;
        Long cargoPartnerId = null;
        Long driverId = null;

        // Automatically create or link associated Customer or Cargo Partner profile
        if (userRole == Role.ROLE_SHIPPER || userRole == Role.ROLE_CUSTOMER) {
            Customer cust = customerRepository.findByEmail(email).orElse(null);
            if (cust == null) {
                cust = Customer.builder()
                        .name(request.getName() != null && !request.getName().trim().isEmpty() ? request.getName().trim() : username)
                        .email(email)
                        .phone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : "+91 98765 43210")
                        .companyName(request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty() ? request.getCompanyName().trim() : "Retail Shipper")
                        .address(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : "Pashan, Pune, Maharashtra")
                        .isCorporate(false)
                        .creditLimit(50000.0)
                        .outstandingBalance(0.0)
                        .build();
                cust = customerRepository.save(cust);
            }
            customerId = cust.getId();
        } else if (userRole == Role.ROLE_CARGO_PARTNER) {
            CargoPartner partner = cargoPartnerRepository.findByEmail(email).orElse(null);
            if (partner == null) {
                partner = CargoPartner.builder()
                        .companyName(request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty() ? request.getCompanyName().trim() : username + " Freight")
                        .ownerName(request.getName() != null && !request.getName().trim().isEmpty() ? request.getName().trim() : username)
                        .email(email)
                        .phone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : "+91 98220 11223")
                        .address(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : "Baner, Pune, Maharashtra")
                        .city("Pune")
                        .latitude(18.5590)
                        .longitude(73.7868)
                        .status(CargoPartner.Status.ACTIVE)
                        .verificationStatus(CargoPartner.VerificationStatus.VERIFIED)
                        .rating(5.0)
                        .totalTrips(0)
                        .build();
                partner = cargoPartnerRepository.save(partner);
            }
            cargoPartnerId = partner.getId();
        }

        // Generate 6-Digit Email Verification OTP (10-minute expiry)
        String otp = generateSixDigitOtp();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime otpExpiry = now.plusMinutes(10);

        User user = User.builder()
                .username(username)
                .email(email)
                .password(encoder.encode(request.getPassword()))
                .role(userRole)
                .emailVerified(false)
                .verificationOtp(otp)
                .verificationOtpExpiry(otpExpiry)
                .otpAttemptCount(0)
                .lastOtpSentAt(now)
                .customerId(customerId)
                .cargoPartnerId(cargoPartnerId)
                .driverId(driverId)
                .active(true)
                .createdAt(now)
                .build();

        user = userRepository.save(user);

        // Dispatch OTP Email
        emailService.sendVerificationOtp(email, username, otp);

        auditLogService.log(username, userRole.name(), "USER_REGISTERED", "USER",
                String.valueOf(user.getId()), "User registered. 6-digit verification OTP dispatched.");
        auditLogService.log(username, userRole.name(), "EMAIL_VERIFICATION_SENT", "USER",
                String.valueOf(user.getId()), "Email verification OTP sent to " + email);

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(request.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(false)
                .customerId(customerId)
                .cargoPartnerId(cargoPartnerId)
                .driverId(driverId)
                .message("Registration successful! A 6-digit verification OTP has been sent to " + email + ". Please verify to login.")
                .build();
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String enteredOtp = request.getOtp() != null ? request.getOtp().trim() : "";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        if (user.isEmailVerified()) {
            return AuthResponse.builder()
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .emailVerified(true)
                    .message("Account is already verified. Please proceed to login.")
                    .build();
        }

        // 1. Check Attempt Count (Brute Force Protection - Max 5 attempts)
        if (user.getOtpAttemptCount() >= 5) {
            throw new TooManyOtpAttemptsException("Too many incorrect attempts. Please request a new OTP.");
        }

        // 2. Check Expiration (10 Minutes)
        LocalDateTime now = LocalDateTime.now();
        if (user.getVerificationOtpExpiry() == null || user.getVerificationOtpExpiry().isBefore(now)) {
            throw new ExpiredOtpException("OTP expired. Please request a new OTP.");
        }

        // 3. Validate OTP Match
        if (user.getVerificationOtp() == null || !user.getVerificationOtp().equals(enteredOtp)) {
            user.setOtpAttemptCount(user.getOtpAttemptCount() + 1);
            userRepository.save(user);
            int remaining = 5 - user.getOtpAttemptCount();
            throw new InvalidOtpException("Invalid verification code. " + (remaining > 0 ? remaining + " attempts remaining." : "Please request a new OTP."));
        }

        // 4. Verification Successful: Reset security fields
        user.setEmailVerified(true);
        user.setVerificationOtp(null);
        user.setVerificationOtpExpiry(null);
        user.setOtpAttemptCount(0);
        userRepository.save(user);

        auditLogService.log(user.getUsername(), user.getRole().name(), "EMAIL_VERIFIED", "USER",
                String.valueOf(user.getId()), "Email verified successfully via 6-digit OTP.");

        return AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(true)
                .message("Email verified successfully! You can now login.")
                .build();
    }

    @Transactional
    public AuthResponse resendOtp(ResendOtpRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        if (user.isEmailVerified()) {
            throw new BadRequestException("This account is already verified. Please login.");
        }

        LocalDateTime now = LocalDateTime.now();

        // Server-Side Rate Limiting: Minimum 60-second cooldown
        if (user.getLastOtpSentAt() != null) {
            long secondsSinceLast = Duration.between(user.getLastOtpSentAt(), now).getSeconds();
            if (secondsSinceLast < 60) {
                long waitSeconds = 60 - secondsSinceLast;
                throw new OtpRateLimitException("Please wait " + waitSeconds + " seconds before requesting a new OTP.");
            }
        }

        // Generate Fresh 6-Digit OTP
        String newOtp = generateSixDigitOtp();
        user.setVerificationOtp(newOtp);
        user.setVerificationOtpExpiry(now.plusMinutes(10));
        user.setOtpAttemptCount(0);
        user.setLastOtpSentAt(now);
        userRepository.save(user);

        // Dispatch Email
        emailService.sendVerificationOtp(user.getEmail(), user.getUsername(), newOtp);

        auditLogService.log(user.getUsername(), user.getRole().name(), "EMAIL_VERIFICATION_SENT", "USER",
                String.valueOf(user.getId()), "Resent verification OTP to " + user.getEmail());

        return AuthResponse.builder()
                .email(user.getEmail())
                .message("A new 6-digit verification code has been dispatched to your email address.")
                .build();
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isEmpty()) {
            throw new BadRequestException("Username or Email is required.");
        }

        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier.toLowerCase()))
                .orElseThrow(() -> new BadCredentialsException("Invalid username/email or password"));

        // Verify BCrypt Password
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            auditLogService.log(user.getUsername(), user.getRole().name(), "LOGIN_FAILED", "USER",
                    String.valueOf(user.getId()), "Failed login attempt (bad credentials).");
            throw new BadCredentialsException("Invalid username/email or password");
        }

        // Unverified User Check
        if (!user.isEmailVerified()) {
            throw new UnverifiedUserException("Please verify your email before logging in. Enter the OTP sent to your inbox.");
        }

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated. Please contact CargoConnect support.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        auditLogService.log(user.getUsername(), user.getRole().name(), "LOGIN_SUCCESS", "USER",
                String.valueOf(user.getId()), "Successful user login.");

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .customerId(user.getCustomerId())
                .cargoPartnerId(user.getCargoPartnerId())
                .driverId(user.getDriverId())
                .message("Login successful")
                .build();
    }

    @Transactional
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        LocalDateTime now = LocalDateTime.now();

        // 60s cooldown between reset requests
        if (user.getLastResetOtpSentAt() != null) {
            long secondsSinceLast = Duration.between(user.getLastResetOtpSentAt(), now).getSeconds();
            if (secondsSinceLast < 60) {
                long waitSeconds = 60 - secondsSinceLast;
                throw new OtpRateLimitException("Please wait " + waitSeconds + " seconds before requesting another password reset OTP.");
            }
        }

        String resetOtp = generateSixDigitOtp();
        user.setPasswordResetOtp(resetOtp);
        user.setPasswordResetOtpExpiry(now.plusMinutes(10));
        user.setPasswordResetAttemptCount(0);
        user.setLastResetOtpSentAt(now);
        userRepository.save(user);

        emailService.sendPasswordResetOtp(user.getEmail(), user.getUsername(), resetOtp);

        auditLogService.log(user.getUsername(), user.getRole().name(), "PASSWORD_RESET_REQUESTED", "USER",
                String.valueOf(user.getId()), "Password reset OTP requested.");

        return AuthResponse.builder()
                .email(user.getEmail())
                .message("Password reset OTP has been sent to your email. It will expire in 10 minutes.")
                .build();
    }

    @Transactional
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String otp = request.getOtp() != null ? request.getOtp().trim() : "";
        String newPassword = request.getNewPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + email));

        // 1. Check Max Attempts
        if (user.getPasswordResetAttemptCount() >= 5) {
            throw new TooManyOtpAttemptsException("Too many incorrect reset attempts. Please request a new OTP.");
        }

        // 2. Check Expiry
        LocalDateTime now = LocalDateTime.now();
        if (user.getPasswordResetOtpExpiry() == null || user.getPasswordResetOtpExpiry().isBefore(now)) {
            throw new ExpiredOtpException("Password reset OTP expired. Please request a new OTP.");
        }

        // 3. Verify OTP
        if (user.getPasswordResetOtp() == null || !user.getPasswordResetOtp().equals(otp)) {
            user.setPasswordResetAttemptCount(user.getPasswordResetAttemptCount() + 1);
            userRepository.save(user);
            int remaining = 5 - user.getPasswordResetAttemptCount();
            throw new InvalidOtpException("Invalid reset code. " + (remaining > 0 ? remaining + " attempts remaining." : "Please request a new OTP."));
        }

        // 4. Validate New Password Strength
        if (!PasswordValidator.isValid(newPassword)) {
            throw new BadRequestException(PasswordValidator.getRequirementsMessage());
        }

        // 5. Hash & Save New Password
        user.setPassword(encoder.encode(newPassword));
        user.setPasswordResetOtp(null);
        user.setPasswordResetOtpExpiry(null);
        user.setPasswordResetAttemptCount(0);
        userRepository.save(user);

        auditLogService.log(user.getUsername(), user.getRole().name(), "PASSWORD_RESET_SUCCESS", "USER",
                String.valueOf(user.getId()), "Password reset successfully via OTP.");

        return AuthResponse.builder()
                .email(user.getEmail())
                .message("Password reset successfully! You may now log in with your new password.")
                .build();
    }

    @Transactional
    public AuthResponse logoutUser(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            if (jwtUtils.validateJwtToken(jwt)) {
                String jti = jwtUtils.getJtiFromJwtToken(jwt);
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                Date expiryDate = jwtUtils.getExpirationDateFromJwtToken(jwt);

                LocalDateTime expiresAt = expiryDate != null 
                        ? expiryDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()
                        : LocalDateTime.now().plusHours(1);

                if (jti != null && !revokedTokenRepository.existsByTokenId(jti)) {
                    RevokedToken revoked = RevokedToken.builder()
                            .tokenId(jti)
                            .username(username)
                            .revokedAt(LocalDateTime.now())
                            .expiresAt(expiresAt)
                            .build();
                    revokedTokenRepository.save(revoked);

                    auditLogService.log(username != null ? username : "ANONYMOUS", "USER", "LOGOUT", "AUTH",
                            jti, "JWT token revoked on logout.");
                }
            }
        }
        SecurityContextHolder.clearContext();
        return AuthResponse.builder().message("Logged out successfully.").build();
    }

    // Legacy verify-email route support
    public AuthResponse verifyEmail(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new BadRequestException("Verification token is missing.");
        }

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or already used verification token."));

        if (user.getVerificationTokenExpiry() != null && user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired. Please request a new verification OTP.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        auditLogService.log(user.getUsername(), user.getRole().name(), "EMAIL_VERIFIED", "USER",
                String.valueOf(user.getId()), "Email verified successfully.");

        return AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .emailVerified(true)
                .message("Email verified successfully! You may now log in.")
                .build();
    }

    public Map<String, String> getDevOtp(String email) {
        String cleanEmail = email != null ? email.trim().toLowerCase() : "";
        User user = userRepository.findByEmail(cleanEmail).orElse(null);
        java.util.Map<String, String> res = new java.util.HashMap<>();
        if (user != null) {
            if (user.getVerificationOtp() != null) {
                res.put("verificationOtp", user.getVerificationOtp());
            }
            if (user.getPasswordResetOtp() != null) {
                res.put("passwordResetOtp", user.getPasswordResetOtp());
            }
            res.put("emailVerified", String.valueOf(user.isEmailVerified()));
        }
        return res;
    }

    public AuthResponse resendVerificationEmail(String email) {
        return resendOtp(new ResendOtpRequest(email));
    }
}
