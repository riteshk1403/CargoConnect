package com.cargoconnect.service;

import com.cargoconnect.dto.LoginRequest;
import com.cargoconnect.dto.RegistrationRequest;
import com.cargoconnect.entity.User;
import com.cargoconnect.entity.UserType;
import com.cargoconnect.exception.ApiException;
import com.cargoconnect.exception.ResourceNotFoundException;
import com.cargoconnect.repository.UserRepository;
import com.cargoconnect.security.JwtTokenUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new ApiException("Email already exists");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("Password and confirm password must match");
        }
        if (request.getPassword().length() < 6) {
            throw new ApiException("Password must be at least 6 characters");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(request.getUserType() != null ? request.getUserType() : UserType.SHIPPER);
        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid password");
        }

        return jwtTokenUtil.generateToken(user.getEmail(), user.getUserType().name());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
