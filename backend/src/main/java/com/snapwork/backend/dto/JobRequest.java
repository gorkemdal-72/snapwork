package com.snapwork.backend.dto;

import com.snapwork.backend.enums.PaymentType;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class JobRequest {

    private String title;
    private String description;

    private Double paymentAmount;
    private PaymentType paymentType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private String city;
    private String district;
    private String streetAndBuilding;

    private Long userId;

    private List<CustomFieldDTO> customFields;
}