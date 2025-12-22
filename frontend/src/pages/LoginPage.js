import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Notification States
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await AuthService.login(email, password);

            // Success Feedback
            setSuccessMsg("Login Successful! Redirecting...");

            // Redirect after 1 second to show the message
            setTimeout(() => {
                navigate("/profile");
                window.location.reload();
            }, 1000);

        } catch (error) {
            // Error Feedback
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.response?.data ||
                error.message ||
                error.toString();

            setErrorMsg( resMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title"> Welcome Back</h2>

                {/* --- SUCCESS MESSAGE (Green Box) --- */}
                {successMsg && (
                    <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "10px", borderRadius: "5px", marginBottom: "15px", border: "1px solid #c3e6cb", textAlign: "center" }}>
                         {successMsg}
                    </div>
                )}

                {/* --- ERROR MESSAGE (Red Box) --- */}
                {errorMsg && (
                    <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "5px", marginBottom: "15px", border: "1px solid #f5c6cb", textAlign: "center" }}>
                         {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Login
                    </button>
                </form>
                <p style={{textAlign: "center", marginTop: 15, fontSize: "0.9rem"}}>
                    New to SnapWork? <a href="/register" style={{color: "#007bff"}}>Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;