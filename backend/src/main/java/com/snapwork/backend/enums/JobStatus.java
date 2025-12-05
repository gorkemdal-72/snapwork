package com.snapwork.backend.enums;

public enum JobStatus {
    OPEN,           // Job is active and accepting applications
    IN_PROGRESS,    // Worker selected, job is ongoing
    COMPLETED,      // Job finished successfully
    CANCELLED       // Employer cancelled the job
}