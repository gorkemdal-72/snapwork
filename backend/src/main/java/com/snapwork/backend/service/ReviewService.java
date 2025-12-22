package com.snapwork.backend.service;

import com.snapwork.backend.dto.ReviewRequest;
import com.snapwork.backend.entity.*;
import com.snapwork.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final WorkerProfileRepository workerRepository;
    private final EmployerProfileRepository employerRepository;
    // EKLENDİ: Bildirim servisi
    private final NotificationService notificationService;

    public ReviewService(ReviewRepository reviewRepository,
                         JobRepository jobRepository,
                         UserRepository userRepository,
                         WorkerProfileRepository workerRepository,
                         EmployerProfileRepository employerRepository,
                         NotificationService notificationService) { // EKLENDİ
        this.reviewRepository = reviewRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.employerRepository = employerRepository;
        this.notificationService = notificationService; // EKLENDİ
    }

    // 1. CREATE REVIEW
    // Creates a new review and sends a notification to the reviewee.
    public void createReview(ReviewRequest request) {
        // Check for duplicates
        if (reviewRepository.existsByJobJobIdAndReviewerUserId(request.getJobId(), request.getReviewerId())) {
            throw new RuntimeException("You have already reviewed this job!");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User reviewer = userRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        Review review = new Review();
        review.setJob(job);
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.saveAndFlush(review);

        // Update average rating for the reviewed user
        updateUserRating(reviewee);

        // --- EKLENEN KISIM: Yorum yapılan kişiye bildirim gönder ---
        String msg = "New Review: " + reviewer.getFirstName() + " " + reviewer.getLastName() + " gave you " + request.getRating() + " stars.";
        // Bildirime tıklayınca profiline gitsin
        String url = "/profile/" + reviewee.getUserId();

        notificationService.sendNotification(reviewee.getUserId(), msg, url);
        // -----------------------------------------------------------
    }

    // 2. GET REVIEWS FOR A USER
    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeUserId(userId);
    }

    // 3. CHECK EXISTING REVIEW (For Edit Mode)
    public Optional<Review> getReviewByJobAndReviewer(Long jobId, Long reviewerId) {
        return reviewRepository.findByJobJobIdAndReviewerUserId(jobId, reviewerId);
    }

    // 4. UPDATE REVIEW
    public void updateReview(Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Security Check
        if (!review.getReviewer().getUserId().equals(request.getReviewerId())) {
            throw new RuntimeException("You are not authorized to edit this review!");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());


        reviewRepository.saveAndFlush(review);

        // Recalculate average rating
        updateUserRating(review.getReviewee());
        User reviewer = review.getReviewer();
        User reviewee = review.getReviewee();

        String msg = "Review Updated: " + reviewer.getFirstName() + " " + reviewer.getLastName() + " updated their review.";
        String url = "/profile/" + reviewee.getUserId();

        notificationService.sendNotification(reviewee.getUserId(), msg, url);
    }

    //  RECALCULATE AVERAGE ---
    private void updateUserRating(User user) {
        List<Review> reviews = reviewRepository.findByRevieweeUserId(user.getUserId());

        if (reviews.isEmpty()) return;

        double sum = 0.0;
        for (Review r : reviews) {
            sum += r.getRating();
        }

        double avg = sum / reviews.size();

        // Update Employer Profile if exists
        Optional<EmployerProfile> employer = employerRepository.findByUser(user);
        if (employer.isPresent()) {
            EmployerProfile e = employer.get();
            e.setAvgRating(avg);
            employerRepository.saveAndFlush(e);
        }

        // Update Worker Profile if exists
        Optional<WorkerProfile> worker = workerRepository.findByUser(user);
        if (worker.isPresent()) {
            WorkerProfile w = worker.get();
            w.setAvgRating(avg);
            workerRepository.saveAndFlush(w);
        }
    }
}