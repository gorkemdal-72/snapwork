import axios from "axios";

const API_URL = "http://localhost:8080/api";

const getUserProfile = (userId) => {
    return axios.get(API_URL + "/users/" + userId + "/profile");
};

// Update Employer
const updateEmployer = (userId, data) => {
    return axios.put(API_URL + "/employer/update/" + userId, data);
};

// Update Worker
const updateWorker = (userId, data) => {
    return axios.put(API_URL + "/worker/update/" + userId, data);
};

const UserService = {
    getUserProfile,
    updateEmployer,
    updateWorker,
};

export default UserService;