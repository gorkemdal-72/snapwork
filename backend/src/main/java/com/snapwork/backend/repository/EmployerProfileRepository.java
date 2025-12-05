package com.snapwork.backend.repository;

import com.snapwork.backend.entity.EmployerProfile;
import com.snapwork.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {
    // Check if this user is already an employer
    boolean existsByUser(User user);

    // Find profile by user
    Optional<EmployerProfile> findByUser(User user);
}