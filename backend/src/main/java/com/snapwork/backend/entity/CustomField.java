package com.snapwork.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "custom_fields")
public class CustomField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "field_id")
    private Long fieldId;

    // Link to the Job
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // FIX: Map 'question' field to 'question_text' column in DB
    @Column(name = "question_text", nullable = false)
    private String question;

    @Column(name = "field_type")
    private String fieldType; // "TEXT", "NUMBER"

    @Column(name = "options")
    private String options;

    @Column(name = "is_required")
    private boolean isRequired = false;
}