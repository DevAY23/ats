import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import { Spinner, Button, Card, Row, Col } from 'react-bootstrap'; // Bootstrap components

const AllotOffice = () => {
  const [employees, setEmployees] = useState([]);
  const [offices, setOffices] = useState([]);
  const [selectedOffices, setSelectedOffices] = useState({}); // Maps employeeId to selected officeId
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_SECRET_KEY; // This will fetch the base URL from .env file

  useEffect(() => {
    fetchEmployees();
    fetchOffices();
  }, []);

  // Fetch employee data
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('auth_token'); // Assuming token is stored in localStorage
      if (!token) {
        console.error('No auth token found');
        return;
      }
      const response = await axios.get(`${baseUrl}/api2/auth/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched Employees:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  // Fetch office data
  const fetchOffices = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api2/officeLocations`);
      console.log('Fetched Offices:', response.data);
      setOffices(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load offices', error);
    }
  };

  // Allot office to employee
  const allotOffice = async (employeeId, officeId) => {
    try {
      const office = offices.find((o) => o._id === officeId);
      const officeName = office?.name || 'Unnamed Office'; // Handle null officeName

      const response = await axios.post(
        `${baseUrl}/api2/assign-office`,
        {
          employeeId,
          officeId,
          officeName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        alert(`Office "${officeName}" allotted successfully`);
        setSelectedOffices((prevSelected) => ({
          ...prevSelected,
          [employeeId]: officeId,
        }));
      } else {
        const errorMessage = response.data.message;
        alert(`Failed to allot office "${officeName}": ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error allotting office', error);
      alert('An error occurred while allotting office');
    }
  };

  // Render the employee list
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Allot Office</h2>
      
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {employees.length === 0 ? (
            <div className="col-12 text-center">
              <p>No employees found</p>
            </div>
          ) : (
            employees.map((employee) => (
              <Col md={4} key={employee.employeeId} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="rounded-circle border p-2"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {employee.profilePic ? (
                          <img
                            src={employee.profilePic}
                            alt="Profile"
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                            }}
                          />
                        ) : (
                          <span className="font-weight-bold text-muted">
                            {employee.name[0]}
                          </span>
                        )}
                      </div>
                      <div className="ms-3">
                        <strong>{employee.name}</strong>
                        <div className="text-muted">ID: {employee.employeeId}</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label>Office:</label>
                      <select
                        className="form-select"
                        value={selectedOffices[employee.employeeId] || ''}
                        onChange={(e) => {
                          setSelectedOffices((prevSelected) => ({
                            ...prevSelected,
                            [employee.employeeId]: e.target.value,
                          }));
                        }}
                      >
                        <option value="">Select Office</option>
                        {offices.length === 0 ? (
                          <option value="">No offices available</option>
                        ) : (
                          offices.map((office) => (
                            <option key={office._id} value={office._id}>
                              {office.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <Button
                      variant="primary"
                      block
                      onClick={() => {
                        if (selectedOffices[employee.employeeId]) {
                          allotOffice(employee.employeeId, selectedOffices[employee.employeeId]);
                        } else {
                          alert('Please select an office');
                        }
                      }}
                    >
                      Allot Office
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default AllotOffice;
