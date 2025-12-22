package com.snapwork.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String city;
    private String role;

    private LocalDate birthDate;
    private String gender;

    private String companyName; // For employer
    private String bio;         // For worker
}