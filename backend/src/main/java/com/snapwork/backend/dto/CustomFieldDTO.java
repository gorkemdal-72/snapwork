package com.snapwork.backend.dto;

import lombok.Data;

@Data
public class CustomFieldDTO {
    private String question;
    private String fieldType;
    private String options;
    private boolean isRequired;
}