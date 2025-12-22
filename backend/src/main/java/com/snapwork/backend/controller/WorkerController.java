package com.snapwork.backend.controller;

import com.snapwork.backend.dto.CreateWorkerRequest;
import com.snapwork.backend.entity.WorkerProfile;
import com.snapwork.backend.service.WorkerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    // create worker profile
    @PostMapping("/create")
    public ResponseEntity<?> createWorker(@RequestBody CreateWorkerRequest request) {
        try {
            WorkerProfile profile = workerService.createWorkerProfile(request);
            return ResponseEntity.ok("Worker Profile Created! ID: " + profile.getWorkerId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    //update worker profile
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateWorker(@PathVariable Long userId, @RequestBody com.snapwork.backend.dto.CreateWorkerRequest request) {
        try {
            WorkerProfile updatedProfile = workerService.updateWorkerProfile(userId, request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}