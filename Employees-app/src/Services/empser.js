import axios from "axios";

// Constants in capital
const BASE_URL = "http://localhost:8080/employees";

export const listemployees = () => {
  return axios.get(BASE_URL + "/GetAll");
};

export const createEmployees = (data) => {
  return axios.post(`${BASE_URL}/add`, data);
};

export const searchEmployees = (keyword) => {
  return axios.get(`${BASE_URL}/search`, {
    params: {
      keyword: keyword
    }
  });
};

export const updateEmployee = (id, employee) => {
  return axios.put(`${BASE_URL}/${id}`, employee);
};

export const deleteEmployees = (employeeId) => {
  return axios.delete(BASE_URL + "/" + employeeId);
};

export const getEmployeeById = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};