package com.snapwork.backend.controller;

import com.snapwork.backend.dto.ReviewRequest;
import com.snapwork.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // submit new review
    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        try {
            reviewService.createReview(request);
            return ResponseEntity.ok("Review submitted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    @GetMapping("/check")
    public ResponseEntity<?> getReview(@RequestParam Long jobId, @RequestParam Long reviewerId) {
        return ResponseEntity.ok(reviewService.getReviewByJobAndReviewer(jobId, reviewerId));
    }

    // update review
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        try {
            reviewService.updateReview(reviewId, request);
            return ResponseEntity.ok("Review updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}