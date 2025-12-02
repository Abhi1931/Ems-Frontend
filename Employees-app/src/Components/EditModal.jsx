// src/components/Employeedata/EditModal.jsx
import React, { useEffect, useState } from "react";

/**
 * Robust EditModal with department dropdown.
 * Props:
 *  - show, onClose, initialData, onSubmit, submitting
 *  - options (optional) : array of strings for dropdown options
 */

const emptyForm = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
};

const defaultOptions = ["Sales", "Tester", "Developer", "Manager"];

const EditModal = ({
                       show,
                       onClose,
                       initialData = null,
                       onSubmit,
                       submitting = false,
                       options = defaultOptions,
                   }) => {
    // ensure form is always an object (never null)
    const [form, setForm] = useState(() =>
        initialData ? { ...emptyForm, ...initialData } : { ...emptyForm }
    );

    // sync when initialData changes or when show toggles
    useEffect(() => {
        setForm(initialData ? { ...emptyForm, ...initialData } : { ...emptyForm });
    }, [initialData, show]);

    if (!show) return null;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        // simple validation guard
        if (!form.firstName || !form.lastName || !form.email) {
            alert("Please fill First name, Last name and Email.");
            return;
        }
        onSubmit(form);
    }

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Employee</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            {/* hidden id field — safe read */}
                            <input type="hidden" name="id" value={form?.id ?? ""} />

                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    className="form-control"
                                    value={form?.firstName ?? ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    className="form-control"
                                    value={form?.lastName ?? ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    value={form?.email ?? ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Department  dropdown */}
                            <div className="mb-3">
                                <label htmlFor="department" className="form-label">
                                    Department
                                </label>

                                <select
                                    id="department"
                                    name="department"
                                    className="form-select"
                                    value={form?.department ?? ""}
                                    onChange={handleChange}
                                >
                                    {/* If current value exists but is not in options, show it as the first option */}
                                    {form?.department && !options.includes(form.department) && (
                                        <option value={form.department}>{form.department}</option>
                                    )}

                                    {/* default empty option */}
                                    <option value="">-- Select department --</option>

                                    {options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-text">Choose employee department or role.</div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-warning" disabled={submitting}>
                                    {submitting ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditModal;