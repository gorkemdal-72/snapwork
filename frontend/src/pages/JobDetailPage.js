import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JobService from "../services/JobService";

const JobDetailPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [questions, setQuestions] = useState([]);

    // Application Form State
    const [showForm, setShowForm] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [answers, setAnswers] = useState({}); // { questionId: "Answer" }

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // 1. Fetch Job Details
        JobService.getJobById(jobId)
            .then(res => setJob(res.data))
            .catch(err => console.error(err));

        // 2. Fetch Job Questions
        JobService.getJobQuestions(jobId)
            .then(res => setQuestions(res.data))
            .catch(err => console.error(err));
    }, [jobId]);

    const handleApplyClick = () => {
        if (!user) { navigate("/login"); return; }
        // Show the application form
        setShowForm(true);
    };

    const handleAnswerChange = (fieldId, value) => {
        setAnswers({ ...answers, [fieldId]: value });
    };

    const submitApplication = (e) => {
        e.preventDefault();

        // Convert answers map to list for Backend
        const responseList = Object.keys(answers).map(fieldId => ({
            fieldId: fieldId,
            responseValue: answers[fieldId]
        }));

        JobService.applyJob(user.userId, jobId, coverLetter, responseList)
            .then(() => {
                alert("Application Sent Successfully! 🚀");
                navigate("/");
            })
            .catch(err => {
                alert("Error: " + (err.response?.data || err.message));
            });
    };

    if (!job) return <div style={{textAlign:"center", marginTop: 50}}>Loading Job...</div>;

    return (
        <div style={{ maxWidth: "800px", margin: "30px auto", padding: "30px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>

            <button onClick={() => navigate(-1)} style={{ marginBottom: 20, border: "none", background: "none", color: "#007bff", cursor: "pointer" }}>← Back</button>

            {/* JOB DETAILS */}
            <h1 style={{ color: "#333", marginTop: 0 }}>{job.title}</h1>
            <h3 style={{ color: "#666", fontWeight: "normal" }}>at {job.employer.companyName}</h3>
            <p style={{ color: "#555" }}>📍 {job.city}, {job.district} | 💰 {job.paymentAmount} ₺</p>
            <hr/>
            <p>{job.description}</p>

            {/* --- APPLICATION FORM SECTION --- */}
            {!showForm ? (
                <button onClick={handleApplyClick} style={{ padding: "12px 25px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", marginTop: 20 }}>
                    Apply Now
                </button>
            ) : (
                <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", border: "1px solid #ddd" }}>
                    <h3 style={{ marginTop: 0 }}>📝 Application Form</h3>

                    <form onSubmit={submitApplication}>

                        {/* 1. Cover Letter (Always Visible) */}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ fontWeight: "bold" }}>Cover Letter (Why should we hire you?)</label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows="4"
                                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                required
                            />
                        </div>

                        {/* 2. Dynamic Questions (If any) */}
                        {questions.length > 0 && (
                            <div style={{ marginBottom: "15px" }}>
                                <h4 style={{ color: "#007bff" }}>Additional Questions</h4>
                                {questions.map(q => (
                                    <div key={q.fieldId} style={{ marginBottom: "10px" }}>
                                        <label>{q.question} {q.required && "*"}</label>
                                        <input
                                            type={q.fieldType === "NUMBER" ? "number" : "text"}
                                            onChange={(e) => handleAnswerChange(q.fieldId, e.target.value)}
                                            required={q.required}
                                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" style={{ flex: 1, padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
                                Submit Application
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JobDetailPage;