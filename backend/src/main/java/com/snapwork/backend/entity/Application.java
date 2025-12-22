package com.snapwork.backend.entity;

import com.snapwork.backend.enums.JobStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_id", "worker_id"}) // Prevent duplicate applications
})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private WorkerProfile worker;

    // CHANGE: Used @Enumerated to handle String conversion automatically
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobStatus status = JobStatus.PENDING; // Default status is PENDING

    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "proposed_price")
    private Double proposedPrice;
}