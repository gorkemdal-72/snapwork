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

    // POST http://localhost:8080/api/reviews/create
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

    // GET http://localhost:8080/api/reviews/check?jobId=1&reviewerId=5
    @GetMapping("/check")
    public ResponseEntity<?> getReview(@RequestParam Long jobId, @RequestParam Long reviewerId) {
        return ResponseEntity.ok(reviewService.getReviewByJobAndReviewer(jobId, reviewerId));
    }

    // PUT http://localhost:8080/api/reviews/{reviewId}
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