import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams to get ID from URL
import JobService from "../services/JobService";

const EditJobPage = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [message, setMessage] = useState("");

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

    useEffect(() => {
        if (jobId) {
            JobService.getJobById(jobId)
                .then((response) => {
                    const job = response.data;

                    setFormData({
                        ...job,
                        userId: user.userId
                    });
                })
                .catch((err) => console.error("Error loading job:", err));
        }
    }, [jobId, user.userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        JobService.updateJob(jobId, formData)
            .then(() => {
                setMessage("Job Updated Successfully!  Redirecting...");
                setTimeout(() => {
                    navigate("/my-jobs");
                }, 1500);
            })
            .catch((err) => {
                alert("Failed to update job.");
            });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}> Edit Job</h2>
            {message && <div style={{ color: "green", fontWeight: "bold", marginBottom: 15 }}>{message}</div>}

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
