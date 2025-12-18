package com.snapwork.backend.dto;

import lombok.Data;

@Data
public class ApplyJobRequest {
    private Long workerId;
    private Long jobId;
    private String coverLetter;
    private Double proposedPrice;
}