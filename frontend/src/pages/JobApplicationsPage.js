import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobService from "../services/JobService";
import Swal from "sweetalert2";

const JobApplicationsPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // SweetAlert2 global config for basic static styling
    const swalOptions = {
        showClass: {
            popup: '',
            backdrop: ''
        },
        hideClass: {
            popup: '',
        },
        customClass: {
            // This removes the default ring border from SweetAlert icons for a cleaner look
            icon: 'border-none'
        }
    };

    // Helper for static icons to avoid animations
    const staticIcons = {
        success: '<span style="font-size: 60px; color: #28a745;">✔</span>',
        error: '<span style="font-size: 60px; color: #dc3545;">✘</span>',
        warning: '<span style="font-size: 60px; color: #ffc107;">!</span>',
        info: '<span style="font-size: 60px; color: #17a2b8;">ℹ️</span>',
    };

    const loadApplications = () => {
        JobService.getJobApplications(jobId)
            .then((response) => {
                setApplications(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                Swal.fire({
                    iconHtml: staticIcons.error, // Static icon
                    title: 'Oops...',
                    text: 'Failed to load applications!',
                    ...swalOptions
                });
            });
    };

    useEffect(() => {
        loadApplications();
    }, [jobId]);

    const handleDecision = (application, status) => {
        let title = "";
        let text = "";
        let iconHtml = staticIcons.warning; // Default static warning
        let confirmButtonText = "Yes, do it!";
        let confirmButtonColor = "#3085d6";

        if (status === "REJECTED") {
            title = "Reject Applicant?";
            text = "Are you sure you want to REJECT this applicant?";
            confirmButtonText = "Yes, Reject";
            confirmButtonColor = "#d33";
        } else {
            confirmButtonColor = "#28a745";
            confirmButtonText = "Yes, Accept";

            if (application.proposedPrice) {
                title = "New Price Offer Detected!";
                text = `This applicant proposed a new price: ${application.proposedPrice} ₺. If you accept, the job price will be updated. Do you confirm?`;
                iconHtml = staticIcons.info;
            } else {
                title = "Accept Applicant?";
                text = "Are you sure you want to ACCEPT this applicant?";
            }
        }

        Swal.fire({
            title: title,
            text: text,
            iconHtml: iconHtml, // Use static HTML instead of animated icon
            showCancelButton: true,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: '#6c757d',
            confirmButtonText: confirmButtonText,
            ...swalOptions
        }).then((result) => {
            if (result.isConfirmed) {
                JobService.updateApplicationStatus(application.applicationId, status)
                    .then(() => {
                        loadApplications();

                        if(status === "ACCEPTED" && application.proposedPrice) {
                            Swal.fire({
                                title: 'Accepted!',
                                text: 'Application Accepted! The job price has been updated.',
                                iconHtml: staticIcons.success, // Static checkmark
                                ...swalOptions
                            });
                        } else {
                            Swal.fire({
                                title: 'Updated!',
                                text: `Applicant has been ${status.toLowerCase()}.`,
                                iconHtml: staticIcons.success, // Static checkmark
                                ...swalOptions
                            });
                        }
                    })
                    .catch(err => {
                        Swal.fire({
                            title: 'Error!',
                            text: "Error: " + err.message,
                            iconHtml: staticIcons.error, // Static cross
                            ...swalOptions
                        });
                    });
            }
        });
    };

    const handleViewForm = (appId) => {
        setShowModal(true);
        setModalLoading(true);
        setSelectedDetails(null);

        JobService.getApplicationDetails(appId)
            .then((res) => {
                setSelectedDetails(res.data);
                setModalLoading(false);
            })
            .catch(err => {
                setShowModal(false);
                Swal.fire({
                    iconHtml: staticIcons.error,
                    title: 'Error',
                    text: 'Failed to load details',
                    ...swalOptions
                });
            });
    };

    if (loading) return <div style={{textAlign:"center", marginTop: 50}}>Loading...</div>;

    return (
        <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>

            {/* Simple style to remove the default border from the custom icon container */}
            <style>
                {`
                    .swal2-icon.border-none {
                        border: none !important;
                    }
                `}
            </style>

            <button onClick={() => navigate(-1)} style={{ marginBottom: 20, border: "none", background: "none", color: "#007bff", cursor: "pointer" }}>← Back to Jobs</button>
            <h2 style={{ textAlign: "center", color: "#2c3e50" }}>📄 Applicant Management</h2>

            <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
                {applications.map((app) => (
                    <div
                        key={app.applicationId}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            borderRadius: "10px",
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <div style={{display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap"}}>
                                <h3 style={{margin: "0 0 5px 0", color: "#007bff"}}>
                                    {app.worker.user.fullName}
                                </h3>

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

                                {app.proposedPrice && (
                                    <span style={{
                                        backgroundColor: "#e8f0fe",
                                        color: "#1967d2",
                                        padding: "2px 8px",
                                        borderRadius: "10px",
                                        fontSize: "0.8rem",
                                        fontWeight: "bold",
                                        border: "1px solid #1967d2"
                                    }}>
                                        Offer: {app.proposedPrice} ₺
                                    </span>
                                )}
                            </div>

                            <p style={{margin: "0", fontStyle: "italic", color: "#555"}}>"{app.worker.bio}"</p>

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
                                    <button onClick={() => handleDecision(app, "ACCEPTED")} style={{
                                        padding: "8px 15px",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}>Accept
                                    </button>
                                    <button onClick={() => handleDecision(app, "REJECTED")} style={{
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

            {showModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", width: "500px", maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
                        <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>

                        <h3 style={{ borderBottom: "2px solid #007bff", paddingBottom: "10px", marginTop: 0 }}>Application Details</h3>

                        {modalLoading ? <p>Loading details...</p> : (
                            selectedDetails && (
                                <div>
                                    {selectedDetails.proposedPrice && (
                                        <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #d63384", borderRadius: "5px", backgroundColor: "rgba(214, 51, 132, 0.1)" }}>
                                            <h4 style={{ margin: "0 0 5px 0", color: "#d63384" }}>💰 New Price Offer</h4>
                                            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#d63384" }}>
                                                {selectedDetails.proposedPrice} ₺
                                            </span>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: "20px" }}>
                                        <h4 style={{ marginBottom: "5px", color: "#aaa" }}>Cover Letter</h4>
                                        <div style={{ backgroundColor: "#333", color: "#fff", padding: "10px", borderRadius: "5px", fontStyle: "italic" }}>
                                            "{selectedDetails.coverLetter}"
                                        </div>
                                    </div>

                                    {selectedDetails.responses && selectedDetails.responses.length > 0 && (
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