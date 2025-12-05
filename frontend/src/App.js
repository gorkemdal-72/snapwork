import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// YENİ EKLENEN IMPORT
import { NotificationProvider } from './context/NotificationContext';

// --- PAGE IMPORTS ---
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateJobPage from "./pages/CreateJobPage";
import CreateEmployerPage from "./pages/CreateEmployerPage";
import CreateWorkerPage from "./pages/CreateWorkerPage";
import ProfilePage from "./pages/ProfilePage";
import MyJobsPage from "./pages/MyJobsPage";
import EditJobPage from "./pages/EditJobPage";
import JobApplicationsPage from "./pages/JobApplicationsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import CompletedJobsPage from "./pages/CompletedJobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import EditProfilePage from "./pages/EditProfilePage";
import NotificationsPage from "./pages/NotificationsPage";

import NotificationService from "./services/NotificationService";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Check user on load
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setCurrentUser(user);
            setRole(user.role);

            // Fetch unread notification count
            NotificationService.getUnreadCount(user.userId)
                .then(res => setUnreadCount(res.data))
                .catch(err => console.error("Notif Error:", err));
        }
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // --- BASIC / CLEAN STYLES ---
    const styles = {
        navbar: {
            backgroundColor: "#fff",
            height: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            borderBottom: "1px solid #ddd", // Simple border
            fontFamily: "Arial, sans-serif"
        },
        logo: {
            color: "#333", // Dark grey/Black
            textDecoration: "none",
            fontSize: "1.4rem",
            fontWeight: "bold",
            letterSpacing: "0.5px"
        },
        navLinksContainer: {
            display: "flex",
            alignItems: "center",
            gap: "15px"
        },
        link: {
            color: "#555", // Neutral grey
            textDecoration: "none",
            fontSize: "0.95rem",
            transition: "color 0.2s"
        },
        activeLink: { // Optional: for active state logic if needed
            color: "#000",
            fontWeight: "bold"
        },
        buttonLink: {
            backgroundColor: "#eee",
            color: "#333",
            padding: "6px 12px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.9rem",
            border: "1px solid #ccc"
        },
        primaryButton: {
            backgroundColor: "#333", // Black/Dark Grey
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.9rem",
            border: "none"
        },
        logoutButton: {
            background: "none",
            border: "1px solid #d9534f", // Muted red border
            color: "#d9534f",
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.85rem",
            marginLeft: "10px"
        },
        notificationBadge: {
            position: "relative",
            textDecoration: "none",
            fontSize: "1.2rem",
            marginRight: "5px",
            color: "#555"
        },
        badgeCount: {
            position: "absolute",
            top: "-6px",
            right: "-6px",
            backgroundColor: "#d9534f", // Muted red
            color: "white",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            fontSize: "0.7rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }
    };

    return (
        // DEĞİŞİKLİK BURADA: NotificationProvider TÜM UYGULAMAYI SARMALIYOR
        <NotificationProvider>
            <Router>
                {/* --- NAVIGATION BAR --- */}
                <div style={styles.navbar}>

                    {/* LOGO */}
                    <Link to="/" style={styles.logo}>
                        SnapWork
                    </Link>

                    {/* MENU LINKS */}
                    <nav style={styles.navLinksContainer}>

                        {/* --- GUEST MENU --- */}
                        {!currentUser && (
                            <>
                                <Link to="/" style={styles.link}>Home</Link>
                                <Link to="/login" style={styles.link}>Login</Link>
                                <Link to="/register" style={styles.primaryButton}>Register</Link>
                            </>
                        )}

                        {/* --- LOGGED IN USER MENU --- */}
                        {currentUser && (
                            <>
                                <Link to="/" style={styles.link}>Home</Link>

                                {/* NOTIFICATIONS */}
                                <Link to="/notifications" style={styles.notificationBadge}>
                                    🔔
                                    {unreadCount > 0 && (
                                        <span style={styles.badgeCount}>{unreadCount}</span>
                                    )}
                                </Link>

                                {/* EMPLOYER MENU */}
                                {role === "EMPLOYER" && (
                                    <>
                                        <Link to="/my-jobs" style={styles.link}>My Jobs</Link>
                                        <Link to="/completed-jobs" style={styles.link}>History</Link>
                                        <Link to="/create-job" style={styles.buttonLink}>
                                            + Post Job
                                        </Link>
                                    </>
                                )}

                                {/* WORKER MENU */}
                                {role === "WORKER" && (
                                    <>
                                        <Link to="/my-applications" style={styles.link}>My Applications</Link>
                                        <Link to="/completed-jobs" style={styles.link}>Job History</Link>
                                    </>
                                )}

                                {/* PROFILE & LOGOUT */}
                                <Link to="/profile" style={styles.link}>Profile</Link>

                                <button onClick={handleLogout} style={styles.logoutButton}>
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div style={{
                    padding: "20px",
                    maxWidth: "1000px",
                    margin: "0 auto",
                    minHeight: "85vh",
                    backgroundColor: "#fff" // Clean white background
                }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route path="/create-employer" element={<CreateEmployerPage />} />
                        <Route path="/create-worker" element={<CreateWorkerPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/edit-profile" element={<EditProfilePage />} />

                        <Route path="/create-job" element={<CreateJobPage />} />
                        <Route path="/my-jobs" element={<MyJobsPage />} />
                        <Route path="/edit-job/:jobId" element={<EditJobPage />} />
                        <Route path="/job-applications/:jobId" element={<JobApplicationsPage />} />

                        <Route path="/my-applications" element={<MyApplicationsPage />} />
                        <Route path="/job/:jobId" element={<JobDetailPage />} />
                        <Route path="/completed-jobs" element={<CompletedJobsPage />} />

                        <Route path="/notifications" element={<NotificationsPage />} />
                    </Routes>
                </div>
            </Router>
        </NotificationProvider>
    );
}

export default App;