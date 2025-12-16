package com.snapwork.backend.controller;

import com.snapwork.backend.dto.JobRequest;
import com.snapwork.backend.entity.Job;
import com.snapwork.backend.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*") // Allow requests from React
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // 1. CREATE JOB (Now supports Custom Fields)
    // POST http://localhost:8080/api/jobs/create
    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestBody JobRequest request) {
        try {
            Job createdJob = jobService.createJob(request);
            return ResponseEntity.ok("Job created successfully! ID: " + createdJob.getJobId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 2. LIST ALL JOBS (Home Page)
    // GET http://localhost:8080/api/jobs
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // 3. GET MY JOBS (Employer Dashboard)
    // GET http://localhost:8080/api/jobs/my-jobs/{userId}
    @GetMapping("/my-jobs/{userId}")
    public ResponseEntity<?> getMyJobs(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(jobService.getJobsByUser(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 4. DELETE JOB
    // DELETE http://localhost:8080/api/jobs/{jobId}?userId={userId}
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId, @RequestParam Long userId) {
        try {
            jobService.deleteJob(jobId, userId);
            return ResponseEntity.ok("Job deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 5. GET SINGLE JOB (Detail Page)
    // GET http://localhost:8080/api/jobs/{jobId}
    @GetMapping("/{jobId}")
    public ResponseEntity<?> getJobById(@PathVariable Long jobId) {
        try {
            return ResponseEntity.ok(jobService.getJobById(jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 6. UPDATE JOB
    // PUT http://localhost:8080/api/jobs/{jobId}
    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Long jobId, @RequestBody JobRequest request) {
        try {
            Job updatedJob = jobService.updateJob(jobId, request);
            return ResponseEntity.ok("Job updated successfully! ID: " + updatedJob.getJobId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 7. MARK AS COMPLETED
    // PUT http://localhost:8080/api/jobs/{jobId}/complete
    @PutMapping("/{jobId}/complete")
    public ResponseEntity<?> completeJob(@PathVariable Long jobId, @RequestParam Long userId) {
        try {
            jobService.completeJob(jobId, userId);
            return ResponseEntity.ok("Job marked as completed!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 8. GET COMPLETED JOBS (History)
    // Endpoint: GET http://localhost:8080/api/jobs/completed/{userId}
    @GetMapping("/completed/{userId}")
    public ResponseEntity<?> getCompletedJobs(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(jobService.getCompletedJobs(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 9. GET QUESTIONS FOR A JOB (For Worker Application Form)
    // GET http://localhost:8080/api/jobs/{jobId}/questions
    @GetMapping("/{jobId}/questions")
    public ResponseEntity<?> getJobQuestions(@PathVariable Long jobId) {
        try {
            return ResponseEntity.ok(jobService.getJobQuestions(jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 10. CANCEL JOB
    // PUT http://localhost:8080/api/jobs/{jobId}/cancel
    @PutMapping("/{jobId}/cancel")
    public ResponseEntity<?> cancelJob(@PathVariable Long jobId, @RequestParam Long userId) {
        try {
            jobService.cancelJob(jobId, userId);
            return ResponseEntity.ok("Job has been cancelled successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}