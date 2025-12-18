package com.snapwork.backend.entity;

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

    @Column(name = "status")
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter; // Default form field

    @Column(name = "proposed_price")
    private Double proposedPrice;
}