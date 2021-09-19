import axios from "axios";

const API_URL = "http://localhost:4000/";

const registerAdminUser = (username, password, email) => {
    return axios
        .post(API_URL + "register_user", {
            username,
            password,
            email
        })
        .then((response) => {
            return response.data;
        });
};

export default {
    registerAdminUser,
};
