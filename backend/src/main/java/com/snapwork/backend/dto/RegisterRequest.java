package com.snapwork.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String city;
    private String role;

    private LocalDate birthDate;
    private String gender;

    private String companyName; // For Employer
    private String bio;         // For Worker
}