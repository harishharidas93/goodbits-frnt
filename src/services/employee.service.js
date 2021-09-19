import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:4000/";

const getAllEmployees = () => {
    return axios.get(API_URL + "get_all_employees", { headers: authHeader() });
};

const addEmployeeDetail = (emp_id, emp_name, emp_email, emp_age, emp_address, emp_mob) => {
    return axios
        .post(API_URL + "add_emp_detail", {
            emp_id, emp_name, emp_email, emp_age, emp_address, emp_mob
        }, { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
};

const deleteEmployee = (emp_id) => {
    return axios
        .post(API_URL + "delete_emp_detail", {
            emp_id
        }, { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
};

const updateEmployee = (emp_id, column, new_value) => {
    return axios
        .post(API_URL + "update_emp_detail", {
            emp_id,
            column,
            new_value
        }, { headers: authHeader() })
        .then((response) => {
            return response.data;
        });
};
const searchForEmployee = (column, new_value) => {
    return axios.get(API_URL + `search_emp_detail/${column}/${new_value}`, { headers: authHeader() });
};

export default {
    getAllEmployees,
    addEmployeeDetail,
    deleteEmployee,
    updateEmployee,
    searchForEmployee
};
