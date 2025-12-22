import React, { useState, useEffect } from "react";
import JobService from "../services/JobService";

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            JobService.getMyApplications(user.userId)
                .then((response) => {
                    setApplications(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, []);

    // Helper function for status colors
    const getStatusBadge = (appStatus, jobStatus) => {

        if (jobStatus === 'CANCELLED') {
            return (
                <span style={{
                    backgroundColor: "#6c757d", // Gri/Füme renk
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    border: "1px solid #555"
                }}>
                     JOB CANCELLED
                </span>
            );
        }
        let color = "#ffc107"; // Pending (Yellow)
        let text = "⏳ PENDING";

        if (appStatus === "ACCEPTED") {
            color = "#28a745"; // Green
            text = " ACCEPTED";
        } else if (appStatus === "REJECTED") {
            color = "#dc3545"; // Red
            text = " REJECTED";
        }
        else if (appStatus === "CANCELED") {
            color = "#dc3545"; // Red
            text = " CANCELED";
        }

        return (
            <span style={{
                backgroundColor: color,
                color: "white",
                padding: "5px 10px",
                borderRadius: "15px",
                fontWeight: "bold",
                fontSize: "0.8rem"
            }}>
            {text}
        </span>
        );
    };

    if (loading) return <h3 style={{textAlign:"center", marginTop: 50}}>Loading...</h3>;

    return (
        <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 30 }}> My Applications</h2>

            {applications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
                    <p>You haven't applied to any jobs yet.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "15px" }}>
                    {applications.map((app) => (
                        <div key={app.applicationId} style={{
                            border: "1px solid #ddd", padding: "20px", borderRadius: "10px",
                            backgroundColor: "white", display: "flex", justifyContent: "space-between", alignItems: "center",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0", color: "#007bff" }}>{app.job.title}</h3>
                                <p style={{ margin: 0, color: "#555" }}>
                                     {app.job.employer.companyName}
                                </p>
                                <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#888" }}>
                                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                {getStatusBadge(app.status, app.job.status)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;