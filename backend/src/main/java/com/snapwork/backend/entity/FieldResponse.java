package com.snapwork.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "field_responses")
public class FieldResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "response_id")
    private Long responseId;

    // Link to the specific Application
    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    // Link to the Question
    @ManyToOne
    @JoinColumn(name = "field_id", nullable = false)
    private CustomField customField;

    @Column(name = "response_value")
    private String responseValue;
}