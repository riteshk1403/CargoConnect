package com.cargoconnect.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> createErrorBody(HttpStatus status, String error, String message, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return body;
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<?> handleDuplicateEmailException(DuplicateEmailException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        String msg = "An account with this email or username already exists. Please login or use Forgot Password.";
        Map<String, Object> body = createErrorBody(HttpStatus.CONFLICT, "Conflict", msg, request);
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidOtpException.class)
    public ResponseEntity<?> handleInvalidOtpException(InvalidOtpException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, "Invalid OTP", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ExpiredOtpException.class)
    public ResponseEntity<?> handleExpiredOtpException(ExpiredOtpException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, "Expired OTP", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TooManyOtpAttemptsException.class)
    public ResponseEntity<?> handleTooManyOtpAttemptsException(TooManyOtpAttemptsException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.TOO_MANY_REQUESTS, "Too Many Attempts", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(OtpRateLimitException.class)
    public ResponseEntity<?> handleOtpRateLimitException(OtpRateLimitException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.TOO_MANY_REQUESTS, "Rate Limit Exceeded", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(UnverifiedUserException.class)
    public ResponseEntity<?> handleUnverifiedUserException(UnverifiedUserException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.UNAUTHORIZED, "Email Not Verified", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage() != null && !ex.getMessage().isEmpty() ? ex.getMessage() : "Invalid username/email or password", request);
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.FORBIDDEN, "Forbidden", "Access denied: you do not have permission to access this resource", request);
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, "Validation Error", "Input validation failed", request);
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        body.put("errors", errors);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> body = createErrorBody(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "An internal error occurred. Please contact support.", request);
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
