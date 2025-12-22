package com.snapwork.backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long jobId;
    private Long reviewerId; // Who is rating
    private Long revieweeId; // Who is being rated
    private Integer rating;  // 1-5
    private String comment;
}