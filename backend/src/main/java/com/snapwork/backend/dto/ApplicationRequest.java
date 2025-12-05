package com.snapwork.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ApplicationRequest {
    private Long userId;
    private Long jobId;

    // Default Form
    private String coverLetter;

    // Custom Answers
    private List<FieldResponseDTO> responses;

    @Data
    public static class FieldResponseDTO {
        private Long fieldId;       // Which question?
        private String responseValue; // The answer
    }
}