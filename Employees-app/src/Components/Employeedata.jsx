// File: src/components/Employeedata/Employeedata.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listemployees, deleteEmployees, searchEmployees, updateEmployee } from "../Services/empser.js";
import SearchBar from "./SearchBar";
import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";

const Employeedata = () => {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editInitialData, setEditInitialData] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const prevEmployeesRef = useRef(null);
    const navigate = useNavigate();

    const getAllEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listemployees();
            setEmployees(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load employees. Try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getAllEmployees();
    }, [getAllEmployees]);

    const handleSearch = useCallback(
        async (query = searchQuery) => {
            setActionLoading(true);
            setError(null);
            try {
                if (query && query.trim()) {
                    const res = await searchEmployees(query.trim());
                    setEmployees(res.data || []);
                } else {
                    await getAllEmployees();
                }
            } catch (err) {
                console.error("Search error:", err);
                setError("Failed to search employees. Please try again.");
            } finally {
                setActionLoading(false);
            }
        },
        [searchQuery, getAllEmployees]
    );

    const toggleEditMode = useCallback(() => {
        setEditMode((v) => {
            const next = !v;
            if (!next) setSelectedEmployeeId(null);
            return next;
        });
    }, []);

    const handleUpdateSelected = useCallback(() => {
        if (!selectedEmployeeId) {
            alert("Please select an employee to update");
            return;
        }
        const selected = employees.find((e) => e.id === selectedEmployeeId);
        if (!selected) {
            setError("Selected employee not found");
            return;
        }
        setEditInitialData({
            id: selected.id,
            firstName: selected.firstName || "",
            lastName: selected.lastName || "",
            email: selected.email || "",
            department: selected.department || "",
        });
        setShowEditModal(true);
    }, [selectedEmployeeId, employees]);

    const handleSubmitUpdate = useCallback(
        async (form) => {
            setActionLoading(true);
            setError(null);
            prevEmployeesRef.current = employees;
            const optimistic = employees.map((e) => (e.id === form.id ? { ...e, ...form } : e));
            setEmployees(optimistic);
            setShowEditModal(false);
            setEditMode(false);
            setSelectedEmployeeId(null);

            try {
                await updateEmployee(form.id, form);
            } catch (err) {
                console.error("Optimistic update failed, rolling back:", err);
                setEmployees(prevEmployeesRef.current || []);
                setError("Failed to update employee. Changes were not saved.");
            } finally {
                prevEmployeesRef.current = null;
                setActionLoading(false);
            }
        },
        [employees]
    );

    const confirmDelete = useCallback((id, name) => {
        setEmployeeToDelete({ id, name });
        setShowDeleteConfirm(true);
    }, []);

    const removeEmployee = useCallback(async () => {
        if (!employeeToDelete) return;
        setActionLoading(true);
        setError(null);

        prevEmployeesRef.current = employees;
        setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
        setShowDeleteConfirm(false);

        try {
            await deleteEmployees(employeeToDelete.id);
        } catch (err) {
            console.error("Optimistic delete failed, rolling back:", err);
            setEmployees(prevEmployeesRef.current || []);
            setError("Failed to delete employee. Please try again.");
        } finally {
            prevEmployeesRef.current = null;
            setEmployeeToDelete(null);
            setActionLoading(false);
        }
    }, [employeeToDelete, employees]);

    const hasEmployees = useMemo(() => employees.length > 0, [employees]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="m-0">List of Employees</h1>
                <div>
                    <button className={`btn ${editMode ? "btn-secondary" : "btn-warning"}`} onClick={toggleEditMode} aria-pressed={editMode}>
                        {editMode ? "Cancel Update" : "Update Employee"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mb-3 d-flex justify-content-between align-items-start">
                    <div>{error}</div>
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close" />
                </div>
            )}

            {editMode && (
                <div className="alert alert-info mb-3 d-flex justify-content-between align-items-center">
                    <div>
                        <p className="mb-1">Select an employee to update</p>
                        {selectedEmployeeId && <small>Selected ID: {selectedEmployeeId}</small>}
                    </div>
                    <div>
                        <button className="btn btn-success" onClick={handleUpdateSelected} disabled={!selectedEmployeeId}>
                            Update Selected Employee
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status" aria-hidden="true" />
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : (
                <>
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={() => handleSearch(searchQuery)}
                        onClear={() => {
                            setSearchQuery("");
                            getAllEmployees();
                        }}
                        searching={actionLoading}
                    />

                    {hasEmployees ? (
                        <div className="table-responsive">
                            <table className="table w-100 table-striped table-bordered">
                                <thead className="table-dark">
                                <tr>
                                    {editMode && <th scope="col">Select</th>}
                                    <th scope="col">ID</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Department</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id}>
                                        {editMode && (
                                            <td>
                                                <input type="radio" name="selectedEmployee" checked={selectedEmployeeId === emp.id} onChange={() => setSelectedEmployeeId(emp.id)} aria-label={`Select employee ${emp.firstName} ${emp.lastName}`} />
                                            </td>
                                        )}
                                        <td>{emp.id}</td>
                                        <td>{emp.firstName}</td>
                                        <td>{emp.lastName}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.department}</td>
                                        <td>
                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => confirmDelete(emp.id, `${emp.firstName} ${emp.lastName}`)} disabled={actionLoading} title={`Delete ${emp.firstName} ${emp.lastName}`}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info">No employees found.</div>
                    )}
                </>
            )}

            <EditModal show={showEditModal} onClose={() => setShowEditModal(false)} initialData={editInitialData} onSubmit={handleSubmitUpdate} submitting={actionLoading} />

            <ConfirmModal show={showDeleteConfirm} title="Confirm Delete" body={`Are you sure you want to delete ${employeeToDelete?.name || ""}`} onCancel={() => { setShowDeleteConfirm(false); setEmployeeToDelete(null); }} onConfirm={removeEmployee} confirming={actionLoading} />
    </div>
  );
};

export default Employeedata