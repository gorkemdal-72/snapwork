package com.snapwork.backend.controller;

import com.snapwork.backend.dto.ApplyJobRequest; // Yeni DTO importu
import com.snapwork.backend.dto.JobRequest;
import com.snapwork.backend.entity.Job;
import com.snapwork.backend.entity.CustomField;
import com.snapwork.backend.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*") // React ile iletişim izni
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // 1. CREATE JOB (İş Oluşturma)
    @PostMapping("/create")
    public ResponseEntity<?> createJob(@RequestBody JobRequest request) {
        try {
            Job createdJob = jobService.createJob(request);
            return ResponseEntity.ok("Job created successfully! ID: " + createdJob.getJobId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 2. LIST ALL JOBS (Ana Sayfa İçin)
    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // 3. GET JOBS BY USER (İşveren Paneli)
    @GetMapping("/my-jobs/{userId}")
    public List<Job> getJobsByUser(@PathVariable Long userId) {
        return jobService.getJobsByUser(userId);
    }

    // 4. DELETE JOB
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId, @RequestParam Long userId) {
        try {
            jobService.deleteJob(jobId, userId);
            return ResponseEntity.ok("Job deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 5. GET JOB BY ID (Detay Sayfası)
    @GetMapping("/{jobId}")
    public Job getJobById(@PathVariable Long jobId) {
        return jobService.getJobById(jobId);
    }

    // 6. UPDATE JOB
    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Long jobId, @RequestBody JobRequest request) {
        try {
            Job updatedJob = jobService.updateJob(jobId, request);
            return ResponseEntity.ok(updatedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 7. COMPLETE JOB
    @PutMapping("/{jobId}/complete")
    public ResponseEntity<?> completeJob(@PathVariable Long jobId, @RequestParam Long userId) {
        try {
            jobService.completeJob(jobId, userId);
            return ResponseEntity.ok("Job marked as completed!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 8. GET COMPLETED JOBS (Geçmiş)
    @GetMapping("/completed/{userId}")
    public List<Job> getCompletedJobs(@PathVariable Long userId) {
        return jobService.getCompletedJobs(userId);
    }

    // 9. GET JOB QUESTIONS
    @GetMapping("/{jobId}/questions")
    public List<CustomField> getJobQuestions(@PathVariable Long jobId) {
        return jobService.getJobQuestions(jobId);
    }

    // 10. CANCEL JOB (İptal Etme)
    @PutMapping("/{jobId}/cancel")
    public ResponseEntity<?> cancelJob(@PathVariable Long jobId, @RequestParam Long userId) {
        try {
            jobService.cancelJob(jobId, userId);
            return ResponseEntity.ok("Job has been cancelled successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 11. APPLY FOR JOB 
    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestBody ApplyJobRequest request) {
        try {
            jobService.applyForJob(request);
            return ResponseEntity.ok("Application submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}