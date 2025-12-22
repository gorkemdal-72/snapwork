package com.snapwork.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateWorkerRequest {
    private Long userId;

    // User table fields (editable)
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDate birthDate;
    private String gender;
    private String city;

    // Worker profile fields
    private String bio;
}