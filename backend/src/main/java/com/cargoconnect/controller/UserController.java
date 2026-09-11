package com.cargoconnect.controller;

import com.cargoconnect.dto.ApiResponse;
import com.cargoconnect.dto.AuthResponse;
import com.cargoconnect.dto.LoginRequest;
import com.cargoconnect.dto.RegistrationRequest;
import com.cargoconnect.entity.User;
import com.cargoconnect.entity.UserType;
import com.cargoconnect.repository.UserRepository;
import com.cargoconnect.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegistrationRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully", user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = userService.login(request);
        User user = userRepository.findByEmail(request.getEmail().trim()).orElseThrow();
        AuthResponse.UserSummary summary = new AuthResponse.UserSummary(
                user.getId(), user.getName(), user.getEmail(), user.getUserType()
        );
        return ResponseEntity.ok(new AuthResponse("Login successful", token, summary));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse(true, "Users fetched successfully", users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(new ApiResponse(true, "User fetched successfully", user));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse> getUsersByType(@PathVariable String type) {
        Iterable<User> users = userRepository.findByUserType(UserType.valueOf(type.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse(true, "Users fetched successfully", users));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully", null));
    }
}
