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

    // Proposed Price State
    const [proposedPrice, setProposedPrice] = useState("");

    // Store answers with fieldId as key: { 1: "Yes", 2: "2500" }
    const [answers, setAnswers] = useState({});

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
        setShowForm(true);
    };

    const handleAnswerChange = (fieldId, value) => {
        setAnswers({ ...answers, [fieldId]: value });
    };

    const submitApplication = (e) => {
        e.preventDefault();

        // Check required fields manually (extra safety)
        for (let q of questions) {
            if (q.isRequired && !answers[q.fieldId]) {
                alert(`Please answer the required question: "${q.question}"`);
                return;
            }
        }

        // Combine Cover Letter + Answers
        let finalCoverLetter = coverLetter;

        if (questions.length > 0) {
            finalCoverLetter += "\n\n--- SCREENING QUESTION RESPONSES ---\n";
            questions.forEach(q => {
                const ans = answers[q.fieldId] || "(No Answer)";
                finalCoverLetter += `Q: ${q.question}\nA: ${ans}\n`;
            });
        }

        // Prepare data for the DTO
        const applyData = {
            workerId: user.userId,
            jobId: parseInt(jobId),
            coverLetter: finalCoverLetter, // Sending combined data
            proposedPrice: proposedPrice ? parseFloat(proposedPrice) : null
        };

        JobService.applyForJob(applyData)
            .then(() => {
                alert("Application Sent Successfully! 🚀");
                navigate("/my-applications");
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || err.response?.data || err.message;
                alert("Error: " + errorMsg);
            });
    };

    if (!job) return <div style={{textAlign:"center", marginTop: 50}}>Loading Job...</div>;

    return (
        <div style={{ maxWidth: "800px", margin: "30px auto", padding: "30px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>

            <button onClick={() => navigate(-1)} style={{ marginBottom: 20, border: "none", background: "none", color: "#007bff", cursor: "pointer" }}>← Back</button>

            {/* JOB DETAILS */}
            <h1 style={{ color: "#333", marginTop: 0 }}>{job.title}</h1>
            <h3 style={{ color: "#666", fontWeight: "normal" }}>at {job.employer.companyName}</h3>
            <p style={{ color: "#555" }}>📍 {job.city}, {job.district} | 💰 <span style={{fontWeight:"bold", color:"#28a745"}}>{job.paymentAmount} ₺</span></p>
            <hr/>
            <p>{job.description}</p>

            {/* APPLICATION FORM SECTION */}
            {!showForm ? (
                <button onClick={handleApplyClick} style={{ padding: "12px 25px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", marginTop: 20 }}>
                    Apply Now
                </button>
            ) : (
                <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", border: "1px solid #ddd" }}>
                    <h3 style={{ marginTop: 0 }}>📝 Application Form</h3>

                    <form onSubmit={submitApplication}>

                        {/* 1. Cover Letter */}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ fontWeight: "bold" }}>Cover Letter (Why should we hire you?)</label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows="4"
                                style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                                required
                                placeholder="I am fit for this job because..."
                            />
                        </div>

                        {/* 2. Proposed Price Field */}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ fontWeight: "bold", display: "block" }}>Proposed Price (Optional)</label>
                            <input
                                type="number"
                                value={proposedPrice}
                                onChange={(e) => setProposedPrice(e.target.value)}
                                placeholder={`Original Offer: ${job.paymentAmount} ₺`}
                                style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                            />
                            <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
                                * Leave empty if you accept the original price ({job.paymentAmount} ₺).
                            </small>
                        </div>

                        {/* 3. Dynamic Questions */}
                        {questions.length > 0 && (
                            <div style={{ marginBottom: "15px", padding: "15px", backgroundColor: "#e3f2fd", borderRadius: "8px", border: "1px solid #b3d7ff" }}>
                                <h4 style={{ color: "#007bff", marginTop: 0 }}>Screening Questions</h4>

                                {questions.map(q => (
                                    <div key={q.fieldId} style={{ marginBottom: "15px" }}>
                                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                                            {q.question} {q.isRequired && <span style={{color:"red"}}>*</span>}
                                        </label>

                                        {/* Render Input based on Field Type */}
                                        {q.fieldType === "TEXT" && (
                                            <input
                                                type="text"
                                                onChange={(e) => handleAnswerChange(q.fieldId, e.target.value)}
                                                required={q.isRequired}
                                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                            />
                                        )}

                                        {q.fieldType === "NUMBER" && (
                                            <input
                                                type="number"
                                                onChange={(e) => handleAnswerChange(q.fieldId, e.target.value)}
                                                required={q.isRequired}
                                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                            />
                                        )}

                                        {q.fieldType === "DROPDOWN" && (
                                            <select
                                                onChange={(e) => handleAnswerChange(q.fieldId, e.target.value)}
                                                required={q.isRequired}
                                                defaultValue=""
                                                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                                            >
                                                <option value="" disabled>Select an option</option>
                                                {q.options && q.options.split(',').map((opt, i) => (
                                                    <option key={i} value={opt.trim()}>{opt.trim()}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
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