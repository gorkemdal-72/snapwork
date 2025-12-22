package com.snapwork.backend.enums;

public enum JobStatus {
    //for jobs
    OPEN,           // Job is active and accepting applications
    IN_PROGRESS,    // Worker selected, job is ongoing
    COMPLETED,      // Job finished successfully
    CANCELLED,      // Employer cancelled the job

    // for applications
    PENDING,        // Worker applied, waiting for employer response
    ACCEPTED,       // Employer accepted the application
    REJECTED        // Employer rejected the application
}