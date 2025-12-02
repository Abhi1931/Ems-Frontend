// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import Employeedata from "./Components/Employeedata.jsx";
import Empcomponent from "./components/Empcomponent";
import "./index.css";
import "./App.css";
import EditModal from "./Components/EditModal.jsx";

export default function App() {
    return (
        <div id="app-root">
            <NavbarComponent />

            <main className="main-content">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Employeedata />} />
                        <Route path="/employees" element={<Employeedata />} />
                        <Route path="/add-new" element={<Empcomponent />} />
                        <Route path="/employees/:id" element={<EditModal />} />
                        {/* add other routes here */}
                    </Routes>
                </div>
            </main>

            <footer className="container text-center small-muted mb-3">
                © {new Date().getFullYear()} Employee App
            </footer>
        </div>
    );
}