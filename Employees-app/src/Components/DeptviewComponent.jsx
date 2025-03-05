import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAllEmployees } from '../Services/empser'; // Assume this service method exists

const DepartmentView = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { department } = useParams();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        // Fetch all employees 
        const response = await fetchAllEmployees();
        const allEmployees = response.data;

        // Filter employees by department (case-insensitive)
        const filtered = allEmployees.filter(
          emp => emp.department.toLowerCase() === department.toLowerCase()
        );

        setEmployees(allEmployees);
        setFilteredEmployees(filtered);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, [department]);

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{department} Department</h2>
      
      {filteredEmployees.length === 0 ? (
        <div className="alert alert-info">
          No employees found in the {department} department.
        </div>
      ) : (
        <div className="row">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{employee.firstName} {employee.lastName}</h5>
                  <p className="card-text">
                    <strong>Email:</strong> {employee.email}<br />
                    <strong>Department:</strong> {employee.department}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentView;