import axios from "axios";

// Port numaran 8080 ise bunu kullan, 8081 ise değiştir.
const API_URL = "http://localhost:8080/api/jobs";
const APP_URL = "http://localhost:8080/api/applications";
const REVIEW_URL = "http://localhost:8080/api/reviews"; // NEW

// 1. Get All Jobs
const getAllJobs = () => {
    return axios.get(API_URL);
};

// 2. Create Job
const createJob = (jobData) => {
    return axios.post(API_URL + "/create", jobData);
};

// 3. Get My Jobs (Employer)
const getMyJobs = (userId) => {
    return axios.get(API_URL + "/my-jobs/" + userId);
};

// 4. Delete Job
const deleteJob = (jobId, userId) => {
    return axios.delete(API_URL + "/" + jobId, { params: { userId } });
};

// 5. Get Job By ID
const getJobById = (jobId) => {
    return axios.get(API_URL + "/" + jobId);
};

// 6. Update Job
const updateJob = (jobId, jobData) => {
    return axios.put(API_URL + "/" + jobId, jobData);
};

// 7. Apply for Job (Worker)
const applyJob = (userId, jobId, coverLetter, responses) => {
    return axios.post(APP_URL + "/apply", {
        userId,
        jobId,
        coverLetter,
        responses
    });
};

// 8. Get Application Count
const getApplicationCount = (jobId) => {
    return axios.get(APP_URL + "/job/" + jobId + "/count");
};

// 9. Get Applications List
const getJobApplications = (jobId) => {
    return axios.get(APP_URL + "/job/" + jobId);
};

// 10. Get My Applications
const getMyApplications = (userId) => {
    return axios.get(APP_URL + "/my-applications/" + userId);
};

// 11. Complete Job
const completeJob = (jobId, userId) => {
    return axios.put(API_URL + "/" + jobId + "/complete", {}, { params: { userId } });
};

// 12. Get Completed Jobs
const getCompletedJobs = (userId) => {
    return axios.get(API_URL + "/completed/" + userId);
};

// 13. Update Application Status
const updateApplicationStatus = (applicationId, status) => {
    return axios.put(`${APP_URL}/${applicationId}/status`, null, {
        params: { status }
    });
};

// 14. GET JOB QUESTIONS
const getJobQuestions = (jobId) => {
    return axios.get(API_URL + "/" + jobId + "/questions");
};

// 15. GET APPLICATION DETAILS
const getApplicationDetails = (applicationId) => {
    return axios.get(`${APP_URL}/${applicationId}/details`);
};

// 16. CREATE REVIEW ( Use ReviewService logic here if you want to keep single file)
const createReview = (reviewData) => {
    return axios.post(REVIEW_URL + "/create", reviewData);
};

// 17. Get User Reviews
const getUserReviews = (userId) => {
    return axios.get(REVIEW_URL + "/user/" + userId);
};

// 18. Check/Get Existing Review
const getMyReview = (jobId, reviewerId) => {
    return axios.get(REVIEW_URL + "/check", { params: { jobId, reviewerId } });
};

// 19. Update Review
const updateReview = (reviewId, reviewData) => {
    return axios.put(REVIEW_URL + "/" + reviewId, reviewData);
};

// 20. Cancel Job
const cancelJob = (jobId, userId) => {
    return axios.put(API_URL + "/" + jobId + "/cancel", null, {
        params: { userId }
    });
};


const JobService = {
    getAllJobs,
    createJob,
    getMyJobs,
    deleteJob,
    getJobById,
    updateJob,
    applyJob,
    getApplicationCount,
    getJobApplications,
    getMyApplications,
    completeJob,
    getCompletedJobs,
    updateApplicationStatus,
    getJobQuestions,
    getApplicationDetails,
    createReview,
    getUserReviews,
    getMyReview,
    updateReview,
    cancelJob,
};

export default JobService;