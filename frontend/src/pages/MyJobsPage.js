import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../services/JobService";

const JobDashboardCard = ({ job, onDelete, onComplete, onCancel }) => {
    const navigate = useNavigate();
    const [applicantCount, setApplicantCount] = useState(0);

    useEffect(() => {
        JobService.getApplicationCount(job.jobId)
            .then(res => setApplicantCount(res.data))
            .catch(err => console.error(err));
    }, [job.jobId]);

    // Only show Active (OPEN) or CANCELLED jobs here.
    // Completed jobs are typically handled in a separate History view.
    if (job.status === 'COMPLETED') return null;

    return (
        <div style={{
            border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", marginBottom: "20px",
            backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px"
        }}>
            <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 5px 0", color: "#2c3e50" }}>{job.title}</h3>
                <p style={{ margin: 0, color: "#7f8c8d", fontSize: "0.9rem" }}>📅 {job.workDate} • 💰 {job.paymentAmount} ₺</p>
                <div style={{ marginTop: "5px" }}>
                    <span style={{
                        padding: "4px 10px",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        backgroundColor: job.status === 'CANCELLED' ? '#f8d7da' : '#e8f5e9',
                        color: job.status === 'CANCELLED' ? '#721c24' : '#2e7d32'
                    }}>
                        {job.status}
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={() => navigate(`/job-applications/${job.jobId}`)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "8px 15px", backgroundColor: "#e3f2fd", color: "#1565c0", border: "1px solid #bbdefb", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                    👥 Applicants <span style={{ backgroundColor: "#1565c0", color: "white", padding: "2px 6px", borderRadius: "10px", fontSize: "0.8rem" }}>{applicantCount}</span>
                </button>

                <button onClick={() => navigate(`/edit-job/${job.jobId}`)} style={{ padding: "8px 15px", backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                    ✏️ Edit
                </button>

                {job.status === 'OPEN' && (
                    <button
                        onClick={() => onCancel(job.jobId)}
                        style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        🚫 Cancel
                    </button>
                )}

                <button onClick={() => onDelete(job.jobId)} style={{ padding: "8px 15px", backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                    🗑️ Delete
                </button>

                <button
                    onClick={() => onComplete(job.jobId)}
                    style={{ padding: "8px 15px", backgroundColor: "#d1e7dd", color: "#0f5132", border: "1px solid #badbcc", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                >
                    ✅ Complete
                </button>
            </div>
        </div>
    );
};

const MyJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            loadJobs();
        }
    }, []);

    const loadJobs = () => {
        JobService.getMyJobs(user.userId)
            .then((res) => {
                // Filter out completed jobs from this view
                const activeJobs = res.data.filter(job => job.status === 'OPEN' || job.status === 'CANCELLED');
                setJobs(activeJobs);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }

    const handleDelete = (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            JobService.deleteJob(jobId, user.userId)
                .then(() => {
                    setJobs(jobs.filter(j => j.jobId !== jobId));
                });
        }
    };

    const handleComplete = (jobId) => {
        if (window.confirm("Mark this job as COMPLETED? It will move to history.")) {
            JobService.completeJob(jobId, user.userId)
                .then(() => {
                    alert("Job Completed! Moved to History.");
                    // Remove from list
                    setJobs(jobs.filter(j => j.jobId !== jobId));
                })
                .catch(err => alert("Error: " + err.message));
        }
    }

    const handleCancel = (jobId) => {
        if (window.confirm("Are you sure you want to CANCEL this job? Applicants will be notified.")) {
            JobService.cancelJob(jobId, user.userId)
                .then(() => {
                    alert("Job Cancelled!");
                    // Update the specific job status in the local state
                    setJobs(jobs.map(j => j.jobId === jobId ? { ...j, status: 'CANCELLED' } : j));
                })
                .catch(err => alert("Error: " + err.message));
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: 50 }}>Loading Dashboard...</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ color: "#2c3e50", margin: 0 }}>📊 Employer Dashboard</h2>
                <span style={{ color: "#7f8c8d" }}>Active Jobs: {jobs.length}</span>
            </div>

            {jobs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9f9f9", borderRadius: "10px", border: "2px dashed #ddd" }}>
                    <h3>No active jobs.</h3>
                    <p style={{ color: "#666" }}>Create a new job or check your Completed History.</p>
                </div>
            ) : (
                <div>
                    {jobs.map(job => (
                        <JobDashboardCard
                            key={job.jobId}
                            job={job}
                            onDelete={handleDelete}
                            onComplete={handleComplete}
                            onCancel={handleCancel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobsPage;