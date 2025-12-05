import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

const createReview = (reviewData) => {
    return axios.post(API_URL + "/create", reviewData);
};

const ReviewService = {
    createReview,
};

export default ReviewService;