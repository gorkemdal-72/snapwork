package com.snapwork.backend.repository;

import com.snapwork.backend.entity.Application;
import com.snapwork.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // 1. Get all applications for a specific job
    List<Application> findByJob(Job job);

    // 2. Count applications for a specific job (For the counter badge)
    long countByJob(Job job);

    // Find applications by Worker
    List<Application> findByWorker(com.snapwork.backend.entity.WorkerProfile worker);
}