package com.snapwork.backend.repository;

import com.snapwork.backend.entity.User;
import com.snapwork.backend.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    // Check if user is already a worker
    boolean existsByUser(User user);

    // Find worker profile by user
    Optional<WorkerProfile> findByUser(User user);
}