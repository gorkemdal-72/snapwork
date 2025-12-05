import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const RegisterPage = () => {
    const navigate = useNavigate();

    // Role State: 'worker' or 'employer'
    const [role, setRole] = useState("worker");

    // Notification States
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        city: "",
        birthDate: "",
        gender: "Male",
        companyName: "",
        bio: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const payload = { ...formData, role: role };
            await AuthService.register(payload);

            // Success Message (Green Box)
            setSuccessMsg("Registration Successful! Redirecting to login...");

            // Redirect after 2 seconds
            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            // Error Message (Red Box)
            const message = error.response?.data || error.message || "Registration Failed";
            setErrorMsg(message);
        }
    };

    return (
        <div className="auth-container" style={{paddingTop: "20px", paddingBottom: "20px"}}>
            <div className="auth-card" style={{maxWidth: "500px"}}>
                <h2 className="auth-title">🚀 Join SnapWork</h2>

                {/* --- INLINE NOTIFICATIONS --- */}
                {successMsg && (
                    <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "5px", marginBottom: "15px", border: "1px solid #c3e6cb", textAlign: "center" }}>
                        ✅ {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "5px", marginBottom: "15px", border: "1px solid #f5c6cb", textAlign: "center" }}>
                        ❌ {errorMsg}
                    </div>
                )}

                {/* ROLE SELECTION */}
                <div className="role-selection">
                    <div className={`role-card ${role === 'worker' ? 'active' : ''}`} onClick={() => setRole('worker')}>
                        👷 Worker
                    </div>
                    <div className={`role-card ${role === 'employer' ? 'active' : ''}`} onClick={() => setRole('employer')}>
                        👔 Employer
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* COMMON FIELDS */}
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group"><label>Email Address</label>
                        <input type="email" name="email" className="form-control" onChange={handleChange} required />
                    </div>

                    <div className="form-group"><label>Password</label>
                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                    </div>

                    <div className="form-group"><label>Phone Number</label>
                        <input type="text" name="phoneNumber" className="form-control" onChange={handleChange} required />
                    </div>

                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                        <div className="form-group">
                            <label>Birth Date</label>
                            <input type="date" name="birthDate" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" className="form-control" onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <hr style={{border:"0", borderTop:"1px solid #eee", margin:"15px 0"}}/>

                    {/* EMPLOYER SPECIFIC FIELDS */}
                    {role === 'employer' && (
                        <div className="form-group" style={{backgroundColor: "#e7f1ff", padding: "15px", borderRadius: "8px"}}>
                            <label style={{color: "#0056b3", fontWeight: "bold"}}>Company Name (Required)</label>
                            <input type="text" name="companyName" className="form-control" onChange={handleChange} required placeholder="e.g. Tech Solutions Ltd." />
                        </div>
                    )}

                    {/* WORKER SPECIFIC FIELDS */}
                    {role === 'worker' && (
                        <div className="form-group" style={{backgroundColor: "#e9ecef", padding: "15px", borderRadius: "8px"}}>
                            <label style={{color: "#495057", fontWeight: "bold"}}>Your Skills / Bio (Required)</label>
                            <textarea name="bio" className="form-control" rows="2" onChange={handleChange} required placeholder="Tell us about your experience..." />
                        </div>
                    )}

                    <button type="submit" className="auth-btn">Create Account</button>
                </form>

                <p style={{textAlign: "center", marginTop: 15, fontSize: "0.9rem"}}>
                    Already have an account? <a href="/login" style={{color: "#007bff"}}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;