import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobService from "../services/JobService";

const EditJobPage = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        paymentAmount: "",
        paymentType: "HOURLY",
        workDate: "",
        startTime: "",
        endTime: "",
        city: "",
        district: "",
        streetAndBuilding: "",
        userId: user ? user.userId : null,
    });

    // HELPER: Convert Date to YYYY-MM-DD
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";

        // Handle array format [2025, 12, 24]
        if (Array.isArray(dateString)) {
            const y = dateString[0];
            const m = String(dateString[1]).padStart(2, '0');
            const d = String(dateString[2]).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
        // Handle DD.MM.YYYY
        if (typeof dateString === 'string' && dateString.includes('.')) {
            const parts = dateString.split('.');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        return dateString;
    };

    // HELPER: Convert Time to HH:mm (Remove seconds if present)
    const formatTimeForInput = (timeString) => {
        if (!timeString) return "";

        // Handle array format [14, 30] or [14, 30, 0]
        if (Array.isArray(timeString)) {
            const h = String(timeString[0]).padStart(2, '0');
            const m = String(timeString[1]).padStart(2, '0');
            return `${h}:${m}`;
        }

        // If time is "14:00:00", slice it to "14:00"
        if (typeof timeString === 'string' && timeString.length > 5) {
            return timeString.substring(0, 5);
        }

        return timeString;
    };

    useEffect(() => {
        if (!user) {
            setError("Please login first.");
            return;
        }

        if (jobId) {
            JobService.getJobById(jobId)
                .then((response) => {
                    const job = response.data;
                    console.log("Data fetched from Backend:", job);

                    setFormData({
                        title: job.title || "",
                        description: job.description || "",
                        paymentAmount: job.paymentAmount || "",
                        paymentType: job.paymentType || "HOURLY",
                        // Format Date and Time for Input fields
                        workDate: formatDateForInput(job.workDate),
                        startTime: formatTimeForInput(job.startTime),
                        endTime: formatTimeForInput(job.endTime),
                        city: job.city || "",
                        district: job.district || "",
                        streetAndBuilding: job.streetAndBuilding || "",
                        userId: user.userId
                    });
                })
                .catch((err) => {
                    console.error("Error loading job:", err);
                    setError("Failed to load job details.");
                });
        }
    }, [jobId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        // Prepare Payload with Correct Formatting
        const payload = {
            ...formData,
            userId: user.userId,
            // Ensure Date is YYYY-MM-DD
            workDate: formatDateForInput(formData.workDate),
            // Ensure Time is HH:mm (Strictly 5 chars)
            startTime: formatTimeForInput(formData.startTime),
            endTime: formatTimeForInput(formData.endTime)
        };

        console.log("Payload sending to Backend:", JSON.stringify(payload, null, 2));

        JobService.updateJob(jobId, payload)
            .then(() => {
                setMessage("Job Updated Successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/my-jobs");
                }, 1500);
            })
            .catch((err) => {
                console.error("Update Error:", err);
                if (err.response && err.response.data) {
                    console.error("Backend Response:", err.response.data);
                    setError("Error: " + (err.response.data.message || "Unknown error occurred."));
                } else {
                    setError("Could not connect to server.");
                }
            });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Edit Job</h2>

            {message && <div style={{ padding: "10px", backgroundColor: "#d4edda", color: "#155724", marginBottom: "15px", borderRadius: "5px" }}>{message}</div>}
            {error && <div style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", marginBottom: "15px", borderRadius: "5px" }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
                <div>
                    <label>Job Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} rows="3" />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <label>Payment Amount (₺):</label>
                        <input type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Type:</label>
                        <select name="paymentType" value={formData.paymentType} onChange={handleChange} style={{ width: "100%", padding: "9px" }}>
                            <option value="HOURLY">Hourly</option>
                            <option value="DAILY">Daily</option>
                            <option value="TOTAL">Total</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <label>Date:</label>
                        <input type="date" name="workDate" value={formData.workDate} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Start Time:</label>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>End Time:</label>
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <label>City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>District:</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                    </div>
                </div>
                <div>
                    <label>Street / Address:</label>
                    <input type="text" name="streetAndBuilding" value={formData.streetAndBuilding} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>
                <button type="submit" style={{ padding: "12px", backgroundColor: "#ffc107", color: "black", border: "none", fontSize: "1rem", cursor: "pointer", marginTop: "10px", fontWeight: "bold" }}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditJobPage;