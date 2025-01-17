import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import { Button, Card, Row, Col, Spinner } from 'react-bootstrap'; // Bootstrap components

const ViewOffice = () => {
  const [employees, setEmployees] = useState([]); // Ensure employees is initialized as an empty array
  const [offices, setOffices] = useState([]); // Store office data
  const [selectedOffice, setSelectedOffice] = useState(null); // Store selected office
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [isEmployeeView, setIsEmployeeView] = useState(false); // Track if employee view is active

  const baseUrl = process.env.REACT_APP_SECRET_KEY; // This will fetch the base URL from .env file

  useEffect(() => {
    fetchOffices(); // Fetch office data on component mount
  }, []);

  // Fetch office data
  const fetchOffices = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api2/officeLocations`);
      setOffices(response.data); // Set the offices data
    } catch (error) {
      console.error('Failed to load offices', error); // Log any errors
    } finally {
      setIsLoading(false); // Set loading state to false when done
    }
  };

  // Fetch employee data for a specific office
  const fetchEmployees = async (officeId) => {
    try {
      const response = await axios.get(`${baseUrl}/api2/employees/office/${officeId}`);
      setEmployees(response.data || []); // Set employee data (if any)
    } catch (error) {
      console.error('Failed to load employees', error); // Log any errors
    }
  };

  // Handle office selection and show corresponding employees
  const handleViewEmployees = (officeId, officeName) => {
    setIsEmployeeView(true); // Set view to employee view
    setSelectedOffice({ id: officeId, name: officeName }); // Set selected office ID and name
    fetchEmployees(officeId); // Fetch employees for the selected office
  };

  // Handle going back to office list
  const handleGoBack = () => {
    setIsEmployeeView(false); // Set to office view
    setSelectedOffice(null); // Reset selected office
    setEmployees([]); // Clear employees list
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">View Office</h2>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : isEmployeeView ? (
        <>
          {/* Show the selected office name in the header */}
          <Button variant="secondary" onClick={handleGoBack} className="mb-4">
            Back to Offices
          </Button>

          {/* Display the selected office name */}
          <h3 className="text-center text-primary mb-4">Employees in  {selectedOffice?.name} </h3>

          {/* Render employee list for selected office */}
          {employees.length === 0 ? (
            <p className="text-center">No employees found in this office</p>
          ) : (
            <Row>
              {employees.map((employee) => (
                <Col md={4} key={employee.employeeId} className="mb-4">
                  <Card>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        {/* Employee Picture */}
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
                          <img
                            src={employee.profilePic || 'defaultProfilePicUrl'} // Use a default picture if none available
                            alt="Employee"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '50%',
                            }}
                          />
                        </div>

                        {/* Employee Details */}
                        <div className="ms-3">
                          <strong>{employee.name}</strong>
                          <div className="text-muted">ID: {employee.employeeId}</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        <>
          {/* Render office cards */}
          <Row>
            {offices.length === 0 ? (
              <div className="col-12 text-center">
                <p>No offices found</p>
              </div>
            ) : (
              offices.map((office) => (
                <Col md={4} key={office._id} className="mb-4">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>{office.name}</h5>
                        <Button
                          variant="info"
                          onClick={() => handleViewEmployees(office._id, office.name)}
                        >
                          View Employees
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default ViewOffice;
