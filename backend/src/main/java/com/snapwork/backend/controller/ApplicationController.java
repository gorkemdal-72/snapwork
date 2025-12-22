package com.snapwork.backend.controller;

import com.snapwork.backend.dto.ApplicationRequest;
import com.snapwork.backend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

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
            // Returns a JSON object for easier parsing on Frontend
            return ResponseEntity.ok(Collections.singletonMap("message", "Application submitted successfully!"));
        } catch (Exception e) {
            String errorMessage = "An unexpected error occurred.";
            String detailedError = e.getMessage();

            // Handle specific Database Trigger errors (e.g., Deadline passed)
            if (detailedError != null && detailedError.contains("The work date for this job has passed")) {
                errorMessage = "Applications are closed because the work date has passed.";
            } else {
                errorMessage = detailedError;
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", errorMessage));
        }
    }

    // 2. GET APPLICATIONS FOR A JOB (Employer View)
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    // 3. GET APPLICATION COUNT (For Badge/Notification)
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
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 5. UPDATE STATUS (Accept/Reject)
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long applicationId, @RequestParam String status) {
        try {
            applicationService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(Collections.singletonMap("message", "Application status updated to " + status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    // 6. GET APPLICATION DETAILS (Cover Letter & Answers)
    @GetMapping("/{applicationId}/details")
    public ResponseEntity<?> getApplicationDetails(@PathVariable Long applicationId) {
        try {
            return ResponseEntity.ok(applicationService.getApplicationDetails(applicationId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}