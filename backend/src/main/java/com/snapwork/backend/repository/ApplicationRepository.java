package com.snapwork.backend.repository;

import com.snapwork.backend.entity.Application;
import com.snapwork.backend.entity.Job;
import com.snapwork.backend.entity.WorkerProfile;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    boolean existsByJobAndWorker(Job job, WorkerProfile worker);

    @Modifying
    @Transactional
    @Query(value = "CALL accept_application_proc(:applicationId)", nativeQuery = true)
    void acceptApplication(@Param("applicationId") Long applicationId);
}