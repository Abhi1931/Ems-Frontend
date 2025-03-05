import React, { useState } from "react";
import axios from "axios";



const Empcomponent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    designation: ""
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveEmployee();
  };

  function saveEmployee() {
    axios.post("http://localhost:8080/employees", formData)
      .then((response) => {
        console.log("Employee registered successfully!", response.data);
        alert("Employee registered successfully!");
        setFormData({ firstName: "", lastName: "", email: "", designation: "" });
      })
      .catch((error) => {
        console.error("Error registering employee:", error.response?.data || error.message);
        alert("Failed to register employee. Check console for details.");
      });
  }

  return (
    <div className="modal-body">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="Enter First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Enter Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="designation" className="form-label">Designation:</label>
          <input
            type="text"
            className="form-control"
            id="designation"
            placeholder="Enter Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Empcomponent;
