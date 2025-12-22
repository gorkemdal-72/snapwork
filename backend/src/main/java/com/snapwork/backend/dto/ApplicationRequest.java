package com.snapwork.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ApplicationRequest {
    private Long userId;
    private Long jobId;

    // Default form
    private String coverLetter;

    // Custom answers
    private List<FieldResponseDTO> responses;

    @Data
    public static class FieldResponseDTO {
        private Long fieldId;       // the question
        private String responseValue; // the answer
    }
}