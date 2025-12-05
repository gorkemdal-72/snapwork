import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobService from "../services/JobService";

const JobApplicationsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // MODAL STATE
    const [showModal, setShowModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const loadApplications = () => {
        JobService.getJobApplications(jobId)
            .then((response) => {
                setApplications(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadApplications();
    }, [jobId]);

    const handleDecision = (appId, status) => {
        const actionText = status === "ACCEPTED" ? "Accept" : "Reject";
        if (window.confirm(`Are you sure you want to ${actionText} this applicant?`)) {
            JobService.updateApplicationStatus(appId, status)
                .then(() => loadApplications())
                .catch(err => alert("Error: " + err.message));
        }
    };

    // --- NEW: View Form Function ---
    const handleViewForm = (appId) => {
        setShowModal(true);
        setModalLoading(true);
        setSelectedDetails(null); // Clear previous

        JobService.getApplicationDetails(appId)
            .then((res) => {
                setSelectedDetails(res.data);
                setModalLoading(false);
            })
            .catch(err => {
                alert("Failed to load details");
                setShowModal(false);
            });
    };

    // --- RENDER ---
    if (loading) return <div style={{textAlign:"center", marginTop: 50}}>Loading...</div>;

    return (
        <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: 20, border: "none", background: "none", color: "#007bff", cursor: "pointer" }}>← Back to Jobs</button>
            <h2 style={{ textAlign: "center", color: "#2c3e50" }}>📄 Applicant Management</h2>

            {/* --- LIST --- */}
            <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
                {applications.map(app => (
                    <div key={app.applicationId} style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px", backgroundColor: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <h3 style={{margin: "0 0 5px 0", color: "#007bff"}}>
                                    {app.worker.user.fullName}
                                </h3>

                                {/* ⭐ WORKER RATING */}
                                <span style={{
                                    backgroundColor: "#ffecb3",
                                    color: "#ff8f00",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold"
                                }}>
                                ⭐ {app.worker.avgRating ? app.worker.avgRating.toFixed(1) : "New"}
                            </span>
                            </div>

                            <p style={{margin: "0", fontStyle: "italic", color: "#555"}}>"{app.worker.bio}"</p>
                            <div style={{fontSize: "0.9rem", color: "#666"}}>
                                📞 {app.worker.phone} | 📍 {app.worker.city}
                            </div>
                            {/* View Form Button */}
                            <button
                                onClick={() => handleViewForm(app.applicationId)}
                                style={{
                                    marginTop: "10px",
                                    padding: "5px 10px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "0.8rem"
                                }}
                            >
                                👁️ View Application Form
                            </button>
                        </div>

                        <div style={{textAlign: "right"}}>
                            {app.status === "PENDING" ? (
                                <div style={{display: "flex", gap: "10px"}}>
                                    <button onClick={() => handleDecision(app.applicationId, "ACCEPTED")} style={{
                                        padding: "8px 15px",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}>Accept
                                    </button>
                                    <button onClick={() => handleDecision(app.applicationId, "REJECTED")} style={{
                                        padding: "8px 15px",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}>Reject
                                    </button>
                                </div>
                            ) : (
                                <span style={{ fontWeight: "bold", color: app.status === "ACCEPTED" ? "green" : "red" }}>{app.status}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL (POPUP) --- */}
            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", width: "500px", maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
                        <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>

                        <h3 style={{ borderBottom: "2px solid #007bff", paddingBottom: "10px", marginTop: 0 }}>Application Details</h3>

                        {modalLoading ? <p>Loading details...</p> : (
                            selectedDetails && (
                                <div>
                                    <div style={{ marginBottom: "20px" }}>
                                        <h4 style={{ marginBottom: "5px", color: "#555" }}>Cover Letter</h4>
                                        <div style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "5px", fontStyle: "italic" }}>
                                            "{selectedDetails.coverLetter}"
                                        </div>
                                    </div>

                                    {selectedDetails.responses.length > 0 && (
                                        <div>
                                            <h4 style={{ marginBottom: "10px", color: "#555" }}>Q&A Responses</h4>
                                            {selectedDetails.responses.map((qa, idx) => (
                                                <div key={idx} style={{ marginBottom: "10px" }}>
                                                    <p style={{ fontWeight: "bold", margin: "0 0 3px 0", fontSize: "0.9rem" }}>{idx+1}. {qa.question}</p>
                                                    <p style={{ margin: 0, color: "#28a745" }}>👉 {qa.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        )}

                        <button onClick={() => setShowModal(false)} style={{ marginTop: "20px", width: "100%", padding: "10px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default JobApplicationsPage;