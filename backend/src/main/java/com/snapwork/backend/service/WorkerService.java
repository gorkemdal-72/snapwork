package com.snapwork.backend.service;

import com.snapwork.backend.dto.CreateWorkerRequest;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.entity.WorkerProfile;
import com.snapwork.backend.repository.UserRepository;
import com.snapwork.backend.repository.WorkerProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class WorkerService {

    private final WorkerProfileRepository workerRepository;
    private final UserRepository userRepository;

    public WorkerService(WorkerProfileRepository workerRepository, UserRepository userRepository) {
        this.workerRepository = workerRepository;
        this.userRepository = userRepository;
    }

    public WorkerProfile createWorkerProfile(CreateWorkerRequest request) {
        // 1. Find User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. CHECK: Does user already have a worker profile?
        if (workerRepository.existsByUser(user)) {
            throw new RuntimeException("Error: You already have a Worker Profile!");
        }

        // 3. Create Profile
        WorkerProfile profile = new WorkerProfile();
        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setPhone(request.getPhoneNumber());
        profile.setCity(request.getCity());

        return workerRepository.save(profile);
    }
    // UPDATE WORKER PROFILE
    public WorkerProfile updateWorkerProfile(Long userId, CreateWorkerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        WorkerProfile profile = workerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found!"));

        // 1. UPDATE USER TABLE INFO
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getBirthDate() != null) user.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) user.setGender(request.getGender());

        userRepository.save(user); // Save User changes

        // 2. UPDATE WORKER PROFILE INFO
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getPhoneNumber() != null) profile.setPhone(request.getPhoneNumber());
        if (request.getCity() != null) profile.setCity(request.getCity());

        return workerRepository.save(profile);
    }
}