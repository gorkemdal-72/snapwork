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

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "question_text", nullable = false)
    private String question;

    @Column(name = "field_type")
    private String fieldType;

    @Column(name = "options", columnDefinition = "TEXT")
    private String options;

    @Column(name = "is_required", nullable = false)
    private boolean isRequired = false;
}