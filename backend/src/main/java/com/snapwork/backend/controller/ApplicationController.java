package com.snapwork.backend.controller;

import com.snapwork.backend.dto.ApplicationRequest;
import com.snapwork.backend.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // 1. APPLY FOR JOB
    // POST http://localhost:8080/api/applications/apply
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody ApplicationRequest request) {
        try {
            applicationService.createApplication(request);
            return ResponseEntity.ok("Application submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 2. GET APPLICATIONS FOR A JOB (Employer View)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    // 3. GET APPLICATION COUNT (For Badge)
    @GetMapping("/job/{jobId}/count")
    public ResponseEntity<?> getApplicationCount(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationCount(jobId));
    }

    // 4. GET MY APPLICATIONS (Worker View)
    @GetMapping("/my-applications/{userId}")
    public ResponseEntity<?> getMyApplications(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(applicationService.getMyApplications(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. UPDATE STATUS (Accept/Reject)
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long applicationId, @RequestParam String status) {
        try {
            applicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok("Application status updated to " + status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET http://localhost:8080/api/applications/{applicationId}/details
    @GetMapping("/{applicationId}/details")
    public ResponseEntity<?> getApplicationDetails(@PathVariable Long applicationId) {
        try {
            return ResponseEntity.ok(applicationService.getApplicationDetails(applicationId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}