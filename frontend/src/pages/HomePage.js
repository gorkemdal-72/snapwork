import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../services/JobService";

const HomePage = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Get user info for role-based button display
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user ? user.role : "GUEST";

    useEffect(() => {
        JobService.getAllJobs()
            .then((response) => {
                // Filter: Show only OPEN jobs
                const openJobs = response.data.filter(job => job.status === 'OPEN');
                setJobs(openJobs);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching jobs:", err);
                setLoading(false);
            });
    }, []);

    // Search Filter Logic
    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Time Formatter
    const formatTime = (time) => time ? time.slice(0, 5) : "";

    //  Render Rating Badge
    const renderRating = (employer) => {
        if (!employer) return null;

        const rating = employer.avgRating;
        // Display rating if it exists and is greater than 0
        const hasRating = rating !== null && rating !== undefined && rating > 0;

        return (
            <span style={{
                backgroundColor: hasRating ? "#ffecb3" : "#e0e0e0",
                color: hasRating ? "#ff8f00" : "#757575",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                marginLeft: "10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
            }}>
            {hasRating ? `⭐ ${rating.toFixed(1)}` : " New"}
        </span>
        );
    };

    if (loading) return <h3 style={{ textAlign: "center", marginTop: 50 }}>Loading jobs...</h3>;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>

            {/* SEARCH HEADER */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ color: "#2c3e50" }}>Find Your Next Job</h1>
                <input
                    type="text"
                    placeholder="🔍 Search by Job Title or City..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: "60%", padding: "15px", borderRadius: "30px",
                        border: "1px solid #ddd", fontSize: "1rem", outline: "none",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                    }}
                />
            </div>

            {/* JOB LIST */}
            <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {filteredJobs.map((job) => (
                    <div key={job.jobId} style={{
                        border: "1px solid #e0e0e0", borderRadius: "10px", backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.05)", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between"
                    }}>
                        <div>
                            {/* COMPANY NAME & RATING */}
                            <div style={{
                                fontSize: "0.85rem", color: "#888", fontWeight: "bold",
                                textTransform: "uppercase", marginBottom: "5px",
                                display: "flex", alignItems: "center"
                            }}>
                                 {job.employer?.companyName || "Unknown"}
                                {renderRating(job.employer)}
                            </div>

                            <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>{job.title}</h3>

                            <p style={{ margin: "5px 0", color: "#555" }}>📍 {job.city}, {job.district}</p>
                            <p style={{ margin: "5px 0", color: "#27ae60", fontWeight: "bold" }}>💰 {job.paymentAmount} ₺ ({job.paymentType})</p>
                            <p style={{ fontSize: "0.9rem", color: "#666" }}>📅 {job.workDate} ({formatTime(job.startTime)} - {formatTime(job.endTime)})</p>
                        </div>

                        <div style={{ marginTop: "15px" }}>
                            {/* Conditional Button: Disabled for Employers */}
                            <button
                                onClick={() => navigate(`/job/${job.jobId}`)}
                                style={{
                                    width: "100%", padding: "10px",
                                    backgroundColor: userRole === "EMPLOYER" ? "#95a5a6" : "#3498db",
                                    color: "white", border: "none", borderRadius: "5px",
                                    cursor: userRole === "EMPLOYER" ? "default" : "pointer",
                                    fontWeight: "bold"
                                }}
                                disabled={userRole === "EMPLOYER"}
                            >
                                {userRole === "EMPLOYER" ? "Employer View" : "View Details"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;