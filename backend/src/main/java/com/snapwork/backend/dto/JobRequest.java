package com.snapwork.backend.dto;

import com.snapwork.backend.enums.PaymentType;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
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