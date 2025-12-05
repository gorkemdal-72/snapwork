package com.snapwork.backend.repository;

import com.snapwork.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews received by a specific user
    List<Review> findByRevieweeUserId(Long userId);

    // Check if review already exists for this job by this user (Prevent double review)
    boolean existsByJobJobIdAndReviewerUserId(Long jobId, Long reviewerId);

    Optional<Review> findByJobJobIdAndReviewerUserId(Long jobId, Long reviewerId);
}
