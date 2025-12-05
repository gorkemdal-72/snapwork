import axios from "axios";

const API_URL = "http://localhost:8080/api/employer";

const createEmployerProfile = (employerData) => {
    return axios.post(API_URL + "/create", employerData);
};

const EmployerService = {
    createEmployerProfile,
};

export default EmployerService;