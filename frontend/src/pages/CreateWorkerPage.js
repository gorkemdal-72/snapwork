import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // We can use direct axios or create WorkerService

const CreateWorkerPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: JSON.parse(localStorage.getItem("user"))?.userId,
        bio: "",
        phone: "",
        city: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/worker/create", formData)
            .then(() => {
                alert("Worker Profile Created! ");
                navigate("/"); // Go Home
            })
            .catch((err) => alert("Error: " + err.message));
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title"> Create Worker Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Short Bio (Skills):</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="text" className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input
                            type="text" className="form-control"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="auth-btn" style={{backgroundColor: "#28a745"}}>
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkerPage;