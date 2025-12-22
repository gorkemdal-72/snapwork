import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployerService from "../services/EmployerService";

const CreateEmployerPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        userId: user ? user.userId : null,
        companyName: "",
        phone: "",
        city: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        EmployerService.createEmployerProfile(formData)
            .then((response) => {
                setMessage("Employer Profile Created! You can now post jobs. 🎉");
                // Redirect to "Create Job" page after 1.5 seconds
                setTimeout(() => {
                    navigate("/create-job");
                }, 1500);
            })
            .catch((err) => {
                const resMessage =
                    (err.response && err.response.data && err.response.data.message) ||
                    err.message ||
                    err.toString();
                setError(resMessage);
            });
    };

    return (
        <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2 style={{ textAlign: "center" }}> Become an Employer</h2>
            <p style={{ textAlign: "center", color: "#666" }}>To post jobs, you need to create a company profile first.</p>

            {message && <div style={{ color: "green", fontWeight: "bold", marginBottom: 15 }}>{message}</div>}
            {error && <div style={{ color: "red", fontWeight: "bold", marginBottom: 15 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>

                <div>
                    <label>Company / Business Name:</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        placeholder="e.g. Tech Solutions Ltd."
                    />
                </div>

                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        placeholder="0555..."
                    />
                </div>

                <div>
                    <label>City:</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        placeholder="Izmir"
                    />
                </div>

                <button type="submit" style={{ padding: "12px", backgroundColor: "#6f42c1", color: "white", border: "none", fontSize: "1rem", cursor: "pointer", marginTop: "10px" }}>
                    Create Profile
                </button>
            </form>
        </div>
    );
};

export default CreateEmployerPage;