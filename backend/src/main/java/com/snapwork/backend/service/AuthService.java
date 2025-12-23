package com.snapwork.backend.service;

import com.snapwork.backend.dto.LoginRequest;
import com.snapwork.backend.dto.LoginResponse;
import com.snapwork.backend.dto.RegisterRequest;
import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.entity.WorkerProfile;
import com.snapwork.backend.repository.EmployerProfileRepository;
import com.snapwork.backend.repository.UserRepository;
import com.snapwork.backend.repository.WorkerProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmployerProfileRepository employerRepository;
    private final WorkerProfileRepository workerRepository;

    public AuthService(UserRepository userRepository,
                       EmployerProfileRepository employerRepository,
                       WorkerProfileRepository workerRepository) {
        this.userRepository = userRepository;
        this.employerRepository = employerRepository;
        this.workerRepository = workerRepository;
    }

    // 1. REGISTER METHOD
    public User register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use!");
        }

        // Create User
        User newUser = new User();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(request.getPassword());
        newUser.setPhoneNumber(request.getPhoneNumber());
        newUser.setCity(request.getCity());
        newUser.setBirthDate(request.getBirthDate());
        newUser.setGender(request.getGender());

        User savedUser = userRepository.save(newUser);

        String role = request.getRole();
        // default
        if (role == null || role.isEmpty()) {
            role = "worker";
        }

        if ("employer".equalsIgnoreCase(role)) {
            EmployerProfile employer = new EmployerProfile();
            employer.setUser(savedUser);
            employer.setCompanyName(request.getCompanyName() != null ? request.getCompanyName() : savedUser.getLastName() + "'s Company");
            employer.setCity(request.getCity());
            employer.setPhone(request.getPhoneNumber());
            employerRepository.save(employer);
        }
        else if ("worker".equalsIgnoreCase(role)) {
            WorkerProfile worker = new WorkerProfile();
            worker.setUser(savedUser);
            worker.setBio(request.getBio() != null ? request.getBio() : "New worker ready to work!");
            worker.setCity(request.getCity());
            worker.setPhone(request.getPhoneNumber());
            workerRepository.save(worker);
        }

        return savedUser;
    }

    // 2. LOGIN METHOD
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found! "));

        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Wrong password! ");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);


        String role = "NONE";
        if (employerRepository.existsByUser(user)) {
            role = "EMPLOYER";
        } else if (workerRepository.existsByUser(user)) {
            role = "WORKER";
        }

        LoginResponse response = new LoginResponse();
        response.setUser(user);
        response.setRole(role);

        return response;
    }
}