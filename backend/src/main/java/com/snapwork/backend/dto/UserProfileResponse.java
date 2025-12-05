package com.snapwork.backend.dto;

import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.entity.User;
import com.snapwork.backend.entity.WorkerProfile;
import lombok.Data;

@Data
public class UserProfileResponse {
    private User user;

    // Status flags
    private boolean hasEmployerProfile;
    private boolean hasWorkerProfile;

    // Detail Objects
    private EmployerProfile employerProfile;
    private WorkerProfile workerProfile;
}