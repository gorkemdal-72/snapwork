import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

// Updated register function
const register = (data) => {
    return axios.post(API_URL + "register", data);
};

const login = (email, password) => {
    return axios
        .post(API_URL + "login", {
            email,
            password,
        })
        .then((response) => {
            if (response.data) {
                const userData = {
                    ...response.data.user,
                    role: response.data.role
                };
                localStorage.setItem("user", JSON.stringify(userData));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const AuthService = {
    register,
    login,
    logout,
};

export default AuthService;