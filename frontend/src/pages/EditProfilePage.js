import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // LocalStorage'dan user'ı alıyoruz
    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: "",
        birthDate: "",
        gender: "Male",
        companyName: "",
        bio: "",
    });

    const [roleType, setRoleType] = useState(null);

    useEffect(() => {
        if (!user) { navigate("/login"); return; }

        UserService.getUserProfile(user.userId)
            .then((res) => {
                const data = res.data;
                const u = data.user;

                let initialData = {
                    firstName: u.firstName || "",
                    lastName: u.lastName || "",
                    phoneNumber: u.phoneNumber || "",
                    city: u.city || "",
                    birthDate: u.birthDate || "",
                    gender: u.gender || "Male",
                    companyName: "",
                    bio: ""
                };

                if (data.hasEmployerProfile) {
                    setRoleType("EMPLOYER");
                    initialData.companyName = data.employerProfile.companyName || "";
                } else if (data.hasWorkerProfile) {
                    setRoleType("WORKER");
                    initialData.bio = data.workerProfile.bio || "";
                }

                setFormData(initialData);
                setLoading(false);
            })
            .catch(err => console.error("Error fetching profile:", err));
    }, [user.userId, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const apiCall = roleType === "EMPLOYER"
            ? UserService.updateEmployer(user.userId, formData)
            : UserService.updateWorker(user.userId, formData);

        apiCall.then(() => {
            alert("Profile Updated Successfully! ✅");
            navigate("/profile");
        }).catch(err => alert("Update Failed: " + err.message));
    };

    if (loading) return <div style={{textAlign:"center", marginTop: 50}}>Loading...</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", padding: "30px", backgroundColor: "white", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>✏️ Edit Profile</h2>

            <form onSubmit={handleSubmit} style={{display: "grid", gap: "15px"}}>

                <h4 style={{
                    margin: "0 0 10px 0",
                    color: "#555",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "5px"
                }}>Personal Information</h4>

                <div style={{flex: 1}}>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                           style={{width: "100%", padding: "8px"}}/>
                </div>
                <div style={{flex: 1}}>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                           style={{width: "100%", padding: "8px"}}/>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                    <div>
                        <label>Phone:</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                               style={{width: "100%", padding: "8px"}}/>
                    </div>
                    <div>
                        <label>City:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange}
                               style={{width: "100%", padding: "8px"}}/>
                    </div>
                </div>

                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                    <div>
                        <label>Birth Date:</label>
                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                               style={{width: "100%", padding: "8px"}}/>
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}
                                style={{width: "100%", padding: "9px"}}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <h4 style={{
                    margin: "15px 0 10px 0",
                    color: "#555",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "5px"
                }}>Professional Details</h4>

                {roleType === "EMPLOYER" && (
                    <div>
                        <label>Company Name:</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                               required style={{width: "100%", padding: "8px"}}/>
                    </div>
                )}

                {roleType === "WORKER" && (
                    <div>
                        <label>Bio / Skills:</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} required
                                  style={{width: "100%", padding: "8px"}} rows="3"/>
                    </div>
                )}

                <button type="submit" style={{
                    marginTop: "10px",
                    padding: "12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}>
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;