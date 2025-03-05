import React, { useEffect, useState } from "react";
import { listemployees, deleteEmployees, searchEmployees, updateEmployee } from "../Services/empser";
import { useNavigate } from "react-router-dom";

const Employeedata = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    designation: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    getAllEmployees();
  }, []);

  function getAllEmployees() {
    setLoading(true);
    listemployees()
      .then((response) => {
        setEmployees(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load employees. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function confirmDelete(id, name) {
    setEmployeeToDelete({ id, name });
    setShowDeleteConfirm(true);
  }

  function removeEmploy(id) {
    deleteEmployees(id)
      .then(() => {
        getAllEmployees();
        setShowDeleteConfirm(false);
        setEmployeeToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        setError("Failed to delete employee. Please try again.");
      });
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchEmployees(searchQuery)
        .then((response) => {
          setEmployees(response.data);
        })
        .catch((error) => {
          console.error("Error searching employees:", error);
          setError("Failed to search employees. Please try again.");
        });
    } else {
      getAllEmployees();
    }
  }

  function toggleEditMode() {
    setEditMode(!editMode);
    setSelectedEmployeeId(null); // Reset selection when toggling edit mode
  }

  function handleRadioChange(id) {
    setSelectedEmployeeId(id);
  }

  function handleUpdateSelected() {
    if (!selectedEmployeeId) {
      alert("Please select an employee to update");
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    
    setFormData({
      id: selectedEmployee.id,
      firstName: selectedEmployee.firstName || "",
      lastName: selectedEmployee.lastName || "",
      email: selectedEmployee.email || "",
      designation: selectedEmployee.designation || ""
    });
    
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmitUpdate(e) {
    e.preventDefault();
    
    updateEmployee(formData.id, formData)
      .then((response) => {
        console.log("Employee updated successfully:", response);
        getAllEmployees();
        setShowModal(false);
        setEditMode(false);
        setSelectedEmployeeId(null);
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
        setError("Failed to update employee. Please try again.");
      });
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h1>List Of Employees</h1>
        <div>
        
          <button 
            className={`btn ${editMode ? 'btn-secondary' : 'btn-warning'}`} 
            onClick={toggleEditMode}
          >
            {editMode ? "Cancel Update" : "Update Employee"}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger mb-3">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      
      {editMode && (
        <div className="alert alert-info mb-3">
          <p>Select an employee to update by clicking the radio button</p>
          {selectedEmployeeId && (
            <button 
              className="btn btn-success"
              onClick={handleUpdateSelected}
            >
              Update Selected Employee
            </button>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Employee search form for main component */}
          <form onSubmit={handleSearch} className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary">Search</button>
            {searchQuery && (
              <button 
                type="button" 
                className="btn btn-outline-secondary ms-2"
                onClick={() => {
                  setSearchQuery('');
                  getAllEmployees();
                }}
              >
                Clear
              </button>
            )}
          </form>

          {/* Employee Table */}
          {employees.length > 0 ? (
            <div className="table-responsive">
              <table className="table w-100 table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    {editMode && <th>Select</th>}
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      {editMode && (
                        <td>
                          <input 
                            type="radio" 
                            name="selectedEmployee" 
                            checked={selectedEmployeeId === emp.id}
                            onChange={() => handleRadioChange(emp.id)}
                          />
                        </td>
                      )}
                      <td>{emp.id}</td>
                      <td>{emp.firstName}</td>
                      <td>{emp.lastName}</td>
                      <td>{emp.email}</td>
                      <td>{emp.designation}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No employees found.
            </div>
          )}
        </>
      )}
      
      {/* Update Employee Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Employee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitUpdate}>
                  <input type="hidden" name="id" value={formData.id} />
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="designation" className="form-label">Designation:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-warning">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {employeeToDelete?.name}?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeEmploy(employeeToDelete.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
         
        </div>
      )}
    </div>
  );
};

export default Employeedata;