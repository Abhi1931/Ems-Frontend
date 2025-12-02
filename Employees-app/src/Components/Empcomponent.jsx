import React, { useState } from "react";
import { createEmployees } from "../Services/empser"; // <-- updated import

// Same dropdown options used in EditModal
const DESIGNATION_OPTIONS = ["Sales", "Tester", "Developer", "Manager"];

const Empcomponent = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        saveEmployee();
    };

    function saveEmployee() {
        createEmployees(formData)
            .then((response) => {
                console.log("Employee registered successfully!", response.data);
                alert("Employee registered successfully!");

                // Reset form after successful submission
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    department: "",
                });
            })
            .catch((error) => {
                console.error("Error registering employee:", error.response?.data || error.message);
                alert("Failed to register employee. Check console for details.");
            });
    }

    return (
        <div className="container mt-4 p-4 shadow rounded bg-light">
            <h3 className="mb-4">Register New Employee</h3>

            <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                        First Name:
                    </label>
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

                {/* Last Name */}
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                        Last Name:
                    </label>
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

                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
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

                {/* DEPARTMENT DROPDOWN */}
                <div className="mb-3">
                    <label htmlFor="department" className="form-label">
                        Department
                    </label>

                    <select
                        id="department"
                        name="department"
                        className="form-select"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select department --</option>
                        {DESIGNATION_OPTIONS.map((opt) => (
                            <option value={opt} key={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>

                    <div className="form-text">Choose employee department or role.</div>
                </div>

                <button type="submit" className="btn btn-success">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Empcomponent;