package com.snapwork.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateEmployerRequest {
    private Long userId;

    // User Table Fields (Editable)
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDate birthDate;
    private String gender;
    private String city;

    // Employer Profile Fields
    private String companyName;
}