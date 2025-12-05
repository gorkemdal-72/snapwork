package com.snapwork.backend.dto;

import com.snapwork.backend.entity.User;
import lombok.Data;

@Data
public class LoginResponse {
    private User user;
    private String role; // "WORKER", "EMPLOYER", "NONE"
}