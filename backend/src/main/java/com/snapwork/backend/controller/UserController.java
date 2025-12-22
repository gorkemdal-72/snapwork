package com.snapwork.backend.controller;

import com.snapwork.backend.dto.UserProfileResponse;
import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.entity.WorkerProfile;
import com.snapwork.backend.repository.EmployerProfileRepository;
import com.snapwork.backend.repository.UserRepository;
import com.snapwork.backend.repository.WorkerProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final EmployerProfileRepository employerRepository;
    private final WorkerProfileRepository workerRepository;

    public UserController(UserRepository userRepository, EmployerProfileRepository employerRepository, WorkerProfileRepository workerRepository) {
        this.userRepository = userRepository;
        this.employerRepository = employerRepository;
        this.workerRepository = workerRepository;
    }
    // get user profile
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = new UserProfileResponse();
        response.setUser(user);

        // 1. check if user employer
        Optional<EmployerProfile> employerProfile = employerRepository.findByUser(user);
        if (employerProfile.isPresent()) {
            response.setHasEmployerProfile(true);
            response.setEmployerProfile(employerProfile.get());
        } else {
            response.setHasEmployerProfile(false);
        }

        // 1. check if user worker
        Optional<WorkerProfile> workerProfile = workerRepository.findByUser(user);
        if (workerProfile.isPresent()) {
            response.setHasWorkerProfile(true);
            response.setWorkerProfile(workerProfile.get());
        } else {
            response.setHasWorkerProfile(false);
        }

        return ResponseEntity.ok(response);
    }
}