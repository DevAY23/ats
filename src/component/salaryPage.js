import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeSalaryPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_SECRET_KEY;

  const fetchEmployees = async (date) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.get(
        `${baseUrl}/api2/employees?endDate=${date.toISOString()}`
      );
      setEmployees(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch employees. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    fetchEmployees(date);
  };

  const handleViewSalary = (employee) => {
    navigate("/salaryManagement", { state: { employee, selectedDate } });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Employee Salary</h1>
      <div className="row justify-content-center mb-4">
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">
            Select End Date:
          </label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            onChange={handleDateChange}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      {!isLoading && employees.length > 0 && (
        <div className="mt-4">
          <h3 className="text-center mb-4">Employees</h3>
          <ul className="list-group">
            {employees.map((employee) => (
              <li
                key={employee.employeeId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5 className="mb-1">{employee.name}</h5>
                  <p className="mb-0 text-muted">Employee ID: {employee.employeeId}</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewSalary(employee)}
                >
                  View Salary
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLoading && employees.length === 0 && selectedDate && !errorMessage && (
        <div className="text-center mt-4">
          <p className="text-muted">No employees found for the selected date.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryPage;
