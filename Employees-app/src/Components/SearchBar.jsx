import React from "react";

const SearchBar = ({ value, onChange, onSearch, onClear, searching }) => (
    <form
        className="d-flex mb-3"
        onSubmit={(e) => {
            e.preventDefault();
            onSearch();
        }}
    >
        <input type="text" className="form-control me-2" placeholder="Search employees..." value={value} onChange={(e) => onChange(e.target.value)} aria-label="Search employees" />
        <button className="btn btn-outline-primary" type="submit" disabled={searching}>
            Search
        </button>
        {value && (
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={onClear} disabled={searching}>
                Clear
            </button>
        )}
    </form>
);

export default SearchBar