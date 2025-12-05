package com.snapwork.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ApplicationDetailsDTO {
    private String coverLetter;
    private List<QuestionAnswer> responses;

    @Data
    public static class QuestionAnswer {
        private String question;
        private String answer;
    }
}