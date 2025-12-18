package com.snapwork.backend.entity;

import com.snapwork.backend.enums.JobStatus;
import com.snapwork.backend.enums.PaymentType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    // RELATIONSHIP: Many jobs can be posted by One Employer
    // This creates 'employer_id' column in the database
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private EmployerProfile employer;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Job Details
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @JsonFormat(pattern = "HH:mm")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    // Payment Info
    @Column(name = "payment_amount", nullable = false)
    private Double paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;

    // Location Info (Simplified Address)
    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String district;

    @Column(name = "street_and_building", nullable = false)
    private String streetAndBuilding;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobStatus status = JobStatus.OPEN;

    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}