package com.snapwork.backend.controller;

import com.snapwork.backend.dto.LoginRequest;
import com.snapwork.backend.dto.LoginResponse;
import com.snapwork.backend.dto.RegisterRequest;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 1. REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User createdUser = authService.register(request);
            return ResponseEntity.ok("User created successfully! ID: " + createdUser.getUserId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 2. LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login Failed: " + e.getMessage());
        }
    }
}