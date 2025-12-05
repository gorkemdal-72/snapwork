package com.snapwork.backend.dto;

import com.snapwork.backend.enums.PaymentType;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class JobRequest {
    // --- Basic Job Info ---
    private String title;
    private String description;

    // --- Payment Info ---
    private Double paymentAmount;
    private PaymentType paymentType; // ENUM: HOURLY, DAILY, TOTAL

    // --- Time Info ---
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // --- Location Info ---
    private String city;
    private String district;
    private String streetAndBuilding;

    // --- Owner Info ---
    private Long userId; // The ID of the user posting the job

        // Employer can send a list of questions to be asked to applicants
    private List<CustomFieldDTO> customFields;
}