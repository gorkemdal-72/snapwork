package com.snapwork.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateWorkerRequest {
    private Long userId;

    // User Table Fields (Editable)
    private String fullName;
    private String phoneNumber; // Phone is usually in User table now
    private LocalDate birthDate;
    private String gender;
    private String city;

    // Worker Profile Fields
    private String bio;
}