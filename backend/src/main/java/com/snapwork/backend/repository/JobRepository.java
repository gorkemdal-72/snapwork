package com.snapwork.backend.repository;

import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.entity.Job;
import com.snapwork.backend.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // 1. Home Page
    List<Job> findAllByOrderByCreatedAtDesc();

    // 2. My Jobs
    List<Job> findByEmployer(EmployerProfile employer);

    // 3. COMPLETED JOBS (FIXED WITH EXPLICIT QUERY)
    // Bu sorgu veritabanına doğrudan "Bana bu patronun COMPLETED olan işlerini ver" der.
    @Query("SELECT j FROM Job j WHERE j.employer = :employer AND j.status = 'COMPLETED'")
    List<Job> findCompletedJobs(@Param("employer") EmployerProfile employer);
}