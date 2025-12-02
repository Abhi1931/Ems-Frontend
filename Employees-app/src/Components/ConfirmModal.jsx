import React from "react";

const ConfirmModal = ({ show, title, body, onCancel, onConfirm, confirming }) => {
    if (!show) return null;
    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title || "Confirm"}</h5>
                        <button type="button" className="btn-close" onClick={onCancel} aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <p>{body}</p>
                        <p className="text-danger">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel} disabled={confirming}>
                            Cancel
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm} disabled={confirming}>
                            {confirming ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;