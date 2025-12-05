import React, { useState, useEffect } from "react";
import JobService from "../services/JobService";

const CompletedJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    // Review Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [targetUserId, setTargetUserId] = useState(null); // ID of the user being reviewed
    const [editingReviewId, setEditingReviewId] = useState(null); // ID of review if editing

    useEffect(() => {
        if (user) {
            // Fetch completed jobs for the current user
            JobService.getCompletedJobs(user.userId)
                .then((res) => setJobs(res.data))
                .catch((err) => console.error("Error loading completed jobs:", err));
        }
    }, [user]);

    // Function to open the Review Modal
    const openReviewModal = async (job) => {
        setSelectedJob(job);
        setRating(5);
        setComment("");
        setTargetUserId(null);
        setEditingReviewId(null);

        console.log(">>> DEBUG: Opening review modal for Job ID:", job.jobId);

        // Step 1: Check if a review already exists (Edit Mode)
        try {
            const existingReviewRes = await JobService.getMyReview(job.jobId, user.userId);
            if (existingReviewRes.data) {
                console.log(">>> DEBUG: Found existing review. Switching to Edit Mode.");
                const r = existingReviewRes.data;

                // Populate form with existing data
                setRating(r.rating);
                setComment(r.comment);
                setEditingReviewId(r.reviewId);

                // CRITICAL: Set the target user ID from the existing review
                if (r.reviewee && r.reviewee.userId) {
                    setTargetUserId(r.reviewee.userId);
                }

                setShowModal(true);
                return; // Stop here, no need to calculate target ID again
            }
        } catch (err) {
            // No existing review found, proceed to Create Mode
            console.log("No existing review found. Switching to Create Mode.");
        }

        // Step 2: Determine Target User ID (Create Mode)
        let targetId = null;

        if (user.role === "WORKER") {
            // If I am a Worker, I rate the Employer
            if (job.employer && job.employer.user) {
                targetId = job.employer.user.userId;
            }
        } else if (user.role === "EMPLOYER") {
            // If I am an Employer, I rate the Worker (Must find the accepted applicant)
            try {
                const res = await JobService.getJobApplications(job.jobId);
                const acceptedApp = res.data.find(app => app.status === "ACCEPTED");

                if (acceptedApp && acceptedApp.worker && acceptedApp.worker.user) {
                    targetId = acceptedApp.worker.user.userId;
                } else {
                    alert("Error: No accepted worker found for this job.");
                    return;
                }
            } catch (err) {
                console.error("Error fetching applications:", err);
                alert("Error fetching job details.");
                return;
            }
        }

        if (targetId) {
            setTargetUserId(targetId);
            setShowModal(true);
        } else {
            alert("Error: Could not determine who to review.");
        }
    };

    // Submit Review (Create or Update)
    const submitReview = () => {
        if (!targetUserId) {
            alert("Error: Target user is missing.");
            return;
        }

        const reviewData = {
            jobId: selectedJob.jobId,
            reviewerId: user.userId,
            revieweeId: targetUserId,
            rating: parseInt(rating),
            comment: comment
        };

        console.log(">>> DEBUG: Submitting Review:", reviewData);

        if (editingReviewId) {
            // UPDATE Existing Review
            JobService.updateReview(editingReviewId, reviewData)
                .then(() => {
                    alert("Review Updated Successfully! ✅");
                    setShowModal(false);
                })
                .catch(err => alert("Update Failed: " + (err.response?.data || err.message)));
        } else {
            // CREATE New Review
            JobService.createReview(reviewData)
                .then(() => {
                    alert("Review Submitted Successfully! ⭐");
                    setShowModal(false);
                })
                .catch(err => alert("Submission Failed: " + (err.response?.data || err.message)));
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 30 }}>✅ Completed Jobs History</h2>

            {jobs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
                    <p style={{ color: "#666" }}>No completed jobs yet.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "15px" }}>
                    {jobs.map((job) => (
                        <div key={job.jobId} style={{
                            border: "1px solid #d1e7dd", padding: "20px", borderRadius: "10px",
                            backgroundColor: "#f3fcf7", display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0", color: "#0f5132" }}>{job.title}</h3>
                                <p style={{ margin: "0", color: "#555", fontSize: "0.9rem" }}>
                                    Completed on: {new Date(job.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => openReviewModal(job)}
                                    style={{
                                        padding: "8px 15px", backgroundColor: "#ffc107", color: "black",
                                        border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    ⭐ Rate & Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- REVIEW MODAL --- */}
            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", width: "400px", boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}>
                        <h3 style={{ marginTop: 0, color: "#333" }}>
                            {editingReviewId ? "✏️ Edit Review" : "⭐ Write a Review"}
                        </h3>

                        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "15px" }}>
                            Reviewing: <strong>{user.role === 'WORKER' ? 'Employer' : 'Worker'}</strong>
                        </p>

                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Rating:</label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "15px", fontSize: "1rem", border: "1px solid #ddd", borderRadius: "5px" }}
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                            <option value="4">⭐⭐⭐⭐ (Good)</option>
                            <option value="3">⭐⭐⭐ (Average)</option>
                            <option value="2">⭐⭐ (Poor)</option>
                            <option value="1">⭐ (Terrible)</option>
                        </select>

                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Comment:</label>
                        <textarea
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "5px", fontFamily: "inherit" }}
                            placeholder="Describe your experience..."
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={submitReview} style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Submit</button>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CompletedJobsPage;