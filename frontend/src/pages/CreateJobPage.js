import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobService from "../services/JobService";

const CreateJobPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Çift tıklamayı engellemek için bu state'i ekledik
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "", description: "", paymentAmount: "", paymentType: "HOURLY",
        workDate: "", startTime: "", endTime: "",
        city: "", district: "", streetAndBuilding: "",
        userId: user ? user.userId : null,
    });

    const [customFields, setCustomFields] = useState([]);

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addQuestion = () => {
        setCustomFields([...customFields, { question: "", fieldType: "TEXT", options: "", isRequired: false }]);
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

        // Eğer zaten gönderiliyorsa durdur
        if (isSubmitting) return;

        setIsSubmitting(true); // Butonu kilitle
        setMessage("");
        setError("");

        const payload = { ...formData, customFields: customFields };

        JobService.createJob(payload)
            .then(() => {
                setMessage("Job Posted Successfully! 🎉 Redirecting...");
                setTimeout(() => {
                    navigate("/my-jobs");
                }, 2000);
            })
            .catch((err) => {
                const resMessage = (err.response && err.response.data && err.response.data.message) || err.message;
                setError("Error: " + resMessage);
                setIsSubmitting(false); // Hata alırsa butonu tekrar aç
            });
    };

    return (
        <div style={{ maxWidth: "700px", margin: "20px auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>📝 Post a Job</h2>

            {message && <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "10px", marginBottom: "10px", textAlign: "center" }}>✅ {message}</div>}
            {error && <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", marginBottom: "10px", textAlign: "center" }}>❌ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
                {/* ... (DİĞER INPUT ALANLARI AYNI KALSIN - Title, Desc, Location vs.) ... */}

                {/* Kısa olması için sadece Screen Questions kısmını ve butonu gösteriyorum */}
                {/* Buradaki 'Job Details' ve 'Time & Location' kısımlarını silme, olduğu gibi kalsın */}
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


                <div style={{ padding: "15px", border: "1px solid #007bff", borderRadius: "8px", backgroundColor: "#f0f8ff" }}>
                    <h3>❓ Screening Questions</h3>
                    {customFields.map((field, index) => (
                        <div key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input type="text" placeholder="Question" value={field.question} onChange={(e) => handleQuestionChange(index, "question", e.target.value)} required style={{ flex: 2, padding: "5px" }} />
                                <select value={field.fieldType} onChange={(e) => handleQuestionChange(index, "fieldType", e.target.value)}>
                                    <option value="TEXT">Text</option>
                                    <option value="NUMBER">Number</option>
                                    <option value="DROPDOWN">Dropdown</option>
                                </select>
                                <button type="button" onClick={() => removeQuestion(index)} style={{ color: "red", border: "none" }}>X</button>
                            </div>
                            {field.fieldType === "DROPDOWN" && (
                                <input type="text" placeholder="Options (comma separated)" value={field.options} onChange={(e) => handleQuestionChange(index, "options", e.target.value)} style={{ width: "100%", marginTop: "5px", padding: "5px" }} />
                            )}
                            <label style={{ fontSize: "0.8rem", marginTop: "5px", display: "block" }}>
                                <input type="checkbox" checked={field.isRequired} onChange={(e) => handleQuestionChange(index, "isRequired", e.target.checked)} /> Required?
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion} style={{ background: "#007bff", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px" }}>+ Add Question</button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting} // Tıklanınca pasif olur
                    style={{
                        padding: "15px",
                        backgroundColor: isSubmitting ? "#ccc" : "#28a745", // Pasifken gri, aktifken yeşil
                        color: "white",
                        border: "none",
                        fontWeight: "bold",
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    {isSubmitting ? "Posting..." : "🚀 Publish Job"}
                </button>
            </form>
        </div>
    );
};

export default CreateJobPage;