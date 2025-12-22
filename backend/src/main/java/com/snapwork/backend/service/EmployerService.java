package com.snapwork.backend.service;

import com.snapwork.backend.dto.CreateEmployerRequest;
import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.repository.EmployerProfileRepository;
import com.snapwork.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class EmployerService {

    private final EmployerProfileRepository employerRepository;
    private final UserRepository userRepository;

    public EmployerService(EmployerProfileRepository employerRepository, UserRepository userRepository) {
        this.employerRepository = employerRepository;
        this.userRepository = userRepository;
    }

    public EmployerProfile createEmployerProfile(CreateEmployerRequest request) {
        // 1. Find the User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. check if user already have employer profile
        if (employerRepository.existsByUser(user)) {
            throw new RuntimeException("You are already an Employer!");
        }

        // 3. Create new employer profile
        EmployerProfile profile = new EmployerProfile();
        profile.setUser(user);
        profile.setCompanyName(request.getCompanyName());

        return employerRepository.save(profile);
    }

    // UPDATE EMPLOYER PROFILE
    public EmployerProfile updateEmployerProfile(Long userId, CreateEmployerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        EmployerProfile profile = employerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found!"));

        // 1. UPDATE USER TABLE
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getBirthDate() != null) user.setBirthDate(request.getBirthDate());
        if (request.getGender() != null) user.setGender(request.getGender());

        userRepository.save(user);

        // 2. UPDATE EMPLOYER PROFILE
        if (request.getCompanyName() != null) profile.setCompanyName(request.getCompanyName());
        if (request.getPhoneNumber() != null) profile.setPhone(request.getPhoneNumber());
        if (request.getCity() != null) profile.setCity(request.getCity());

        return employerRepository.save(profile);
    }
}