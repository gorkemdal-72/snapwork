import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user) {
            UserService.getUserProfile(user.userId)
                .then((response) => {
                    setProfileData(response.data);
                })
                .catch((err) => console.error(err));
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
        window.location.reload();
    };

    if (!profileData) return <div style={{textAlign:"center", marginTop: 50}}>Loading...</div>;

    return (
        <div style={{
            maxWidth: "600px", margin: "50px auto", padding: "30px",
            backgroundColor: "white", borderRadius: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)", textAlign: "center"
        }}>

            {/* 1. USER HEADER */}
            <div style={{marginBottom: "30px"}}>
                <div style={{
                    width: "80px", height: "80px", backgroundColor: "#007bff", color: "white",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem", fontWeight: "bold", margin: "0 auto 15px auto"
                }}>
                    {profileData.user.firstName.charAt(0).toUpperCase()}
                </div>

                <h2 style={{margin: "10px 0 5px 0", color: "#333"}}>
                    {profileData.user.firstName} {profileData.user.lastName}
                </h2>
                <p style={{color: "#666", margin: "5px 0"}}>{profileData.user.email}</p>

                {/* Personal Details */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    fontSize: "0.9rem",
                    color: "#888",
                    marginTop: "5px"
                }}>
                    <span>📍 {profileData.user.city || "Unknown City"}</span>
                    <span>👤 {profileData.user.gender || "Unknown Gender"}</span>
                </div>
            </div>

            <hr style={{border: "0", borderTop: "1px solid #eee", margin: "20px 0"}}/>

            {/* 2. ROLE INFO (Dynamic) */}
            <div style={{ marginBottom: "30px" }}>

                {/* EMPLOYER CARD */}
                {profileData.hasEmployerProfile && (
                    <div style={{ padding: "20px", backgroundColor: "#e3f2fd", borderRadius: "10px", border: "1px solid #bbdefb" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "5px" }}></div>
                        <h3 style={{ margin: "5px 0", color: "#0d47a1" }}>Employer Profile</h3>
                        {profileData.employerProfile && (
                            <div style={{ marginTop: "15px", textAlign: "left", padding: "0 15px" }}>
                                <p><strong>Company:</strong> {profileData.employerProfile.companyName}</p>
                                <p><strong>Phone:</strong> {profileData.employerProfile.phone || "N/A"}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* WORKER CARD */}
                {profileData.hasWorkerProfile && (
                    <div style={{ padding: "20px", backgroundColor: "#e8f5e9", borderRadius: "10px", border: "1px solid #c8e6c9" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "5px" }}></div>
                        <h3 style={{ margin: "5px 0", color: "#1b5e20" }}>Worker Profile</h3>

                        {profileData.workerProfile && (
                            <div style={{ marginTop: "15px", textAlign: "left", padding: "0 15px" }}>
                                <p><strong>Bio / Skills:</strong></p>
                                <p style={{ fontStyle: "italic", color: "#555" }}>"{profileData.workerProfile.bio}"</p>
                                <p><strong>Phone:</strong> {profileData.workerProfile.phone || "N/A"}</p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* 3. ACTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => navigate("/edit-profile")} style={{
                    width: "100%", padding: "12px", backgroundColor: "#ffc107", color: "black",
                    border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer"
                }}>
                     Edit Profile
                </button>

                <button onClick={handleLogout} style={{
                    width: "100%", padding: "12px", backgroundColor: "#dc3545", color: "white",
                    border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer"
                }}>
                    Sign Out
                </button>
            </div>

        </div>
    );
};

export default ProfilePage;