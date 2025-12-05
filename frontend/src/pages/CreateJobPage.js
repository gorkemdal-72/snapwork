import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../services/JobService";

const CreateJobPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // --- İŞTE BU SATIRLAR EKSİKTİ, GERİ GELDİ 👇 ---
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    // -----------------------------------------------

    // Main Job Form State
    const [formData, setFormData] = useState({
        title: "", description: "", paymentAmount: "", paymentType: "HOURLY",
        workDate: "", startTime: "", endTime: "",
        city: "", district: "", streetAndBuilding: "",
        userId: user ? user.userId : null,
    });

    // Custom Questions State
    const [customFields, setCustomFields] = useState([]);

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- QUESTION BUILDER LOGIC ---
    const addQuestion = () => {
        setCustomFields([...customFields, { question: "", fieldType: "TEXT", isRequired: false }]);
    };

    const removeQuestion = (index) => {
        const list = [...customFields];
        list.splice(index, 1);
        setCustomFields(list);
    };

    const handleQuestionChange = (index, key, value) => {
        const list = [...customFields];
        list[index][key] = value;
        setCustomFields(list);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset messages
        setMessage("");
        setError("");

        // Combine Job Data + Questions
        const payload = {
            ...formData,
            customFields: customFields
        };

        JobService.createJob(payload)
            .then(() => {
                setMessage("Job Posted Successfully with Questions! 🎉 Redirecting...");
                setTimeout(() => {
                    navigate("/my-jobs");
                }, 2000);
            })
            .catch((err) => {
                const resMessage = (err.response && err.response.data && err.response.data.message) || err.message || err.toString();
                setError("Error: " + resMessage);
            });
    };

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>📝 Post a Job</h2>

            {/* --- BİLDİRİM ALANLARI --- */}
            {message && (
                <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "15px", borderRadius: "5px", marginBottom: "20px", border: "1px solid #c3e6cb", textAlign:"center", fontWeight:"bold" }}>
                    ✅ {message}
                </div>
            )}

            {error && (
                <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "15px", borderRadius: "5px", marginBottom: "20px", border: "1px solid #f5c6cb", textAlign:"center", fontWeight:"bold" }}>
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>

                {/* --- BASIC INFO --- */}
                <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "white" }}>
                    <h3>Job Details</h3>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />

                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} rows="3" />

                    <div style={{ display: "flex", gap: "10px" }}>
                        <input type="number" name="paymentAmount" placeholder="Price" value={formData.paymentAmount} onChange={handleChange} required style={{ flex: 1, padding: "8px" }} />
                        <select name="paymentType" value={formData.paymentType} onChange={handleChange} style={{ flex: 1, padding: "8px" }}>
                            <option value="HOURLY">Hourly</option>
                            <option value="DAILY">Daily</option>
                            <option value="TOTAL">Total</option>
                        </select>
                    </div>
                </div>

                {/* --- LOCATION & TIME --- */}
                <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "white" }}>
                    <h3>Time & Location</h3>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <input type="date" name="workDate" value={formData.workDate} onChange={handleChange} required style={{ flex: 1, padding: "8px" }} />
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={{ flex: 1, padding: "8px" }} />
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={{ flex: 1, padding: "8px" }} />
                    </div>
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
                    <input type="text" name="streetAndBuilding" placeholder="Address" value={formData.streetAndBuilding} onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
                </div>

                {/* --- CUSTOM QUESTIONS SECTION --- */}
                <div style={{ padding: "15px", border: "1px solid #007bff", borderRadius: "8px", backgroundColor: "#f0f8ff" }}>
                    <h3>❓ Screening Questions (Optional)</h3>

                    {customFields.map((field, index) => (
                        <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <span style={{ fontWeight: "bold" }}>{index + 1}.</span>
                            <input
                                type="text"
                                placeholder="Type your question..."
                                value={field.question}
                                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                required
                                style={{ flex: 2, padding: "8px" }}
                            />
                            <select
                                value={field.fieldType}
                                onChange={(e) => handleQuestionChange(index, "fieldType", e.target.value)}
                                style={{ flex: 1, padding: "8px" }}
                            >
                                <option value="TEXT">Text Answer</option>
                                <option value="NUMBER">Number</option>
                            </select>
                            <button type="button" onClick={() => removeQuestion(index)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>X</button>
                        </div>
                    ))}

                    <button type="button" onClick={addQuestion} style={{ background: "#007bff", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
                        + Add Question
                    </button>
                </div>

                <button type="submit" style={{ padding: "15px", backgroundColor: "#28a745", color: "white", border: "none", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" }}>
                    🚀 Publish Job
                </button>
            </form>
        </div>
    );
};

export default CreateJobPage;