package com.snapwork.backend.repository;

import com.snapwork.backend.entity.Application;
import com.snapwork.backend.entity.Job;
import com.snapwork.backend.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // 1. Get all applications associated with a specific job
    List<Application> findByJob(Job job);

    // 2. Count the number of applications for a specific job
    long countByJob(Job job);

    // 3. Find all applications submitted by a specific worker
    List<Application> findByWorker(WorkerProfile worker);

    // 4. Check if a worker has already applied for a specific job
    boolean existsByJobAndWorker(Job job, WorkerProfile worker);
}