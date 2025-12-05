package com.snapwork.backend.controller;

import com.snapwork.backend.dto.CreateEmployerRequest;
import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.service.EmployerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin(origins = "*")
public class EmployerController {

    private final EmployerService employerService;

    public EmployerController(EmployerService employerService) {
        this.employerService = employerService;
    }

    // POST http://localhost:8080/api/employer/create
    @PostMapping("/create")
    public ResponseEntity<?> createEmployer(@RequestBody CreateEmployerRequest request) {
        try {
            EmployerProfile profile = employerService.createEmployerProfile(request);
            return ResponseEntity.ok("Employer Profile Created! ID: " + profile.getProfileId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT http://localhost:8080/api/employer/update/{userId}
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateEmployer(@PathVariable Long userId, @RequestBody CreateEmployerRequest request) {
        try {
            EmployerProfile updatedProfile = employerService.updateEmployerProfile(userId, request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}