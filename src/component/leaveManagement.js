import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Modal } from 'react-bootstrap';

const WeekoffManagementScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeekoffDays, setSelectedWeekoffDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const token = localStorage.getItem('auth_token'); // Assuming the token is stored in localStorage

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const baseUrl = process.env.REACT_APP_SECRET_KEY;

  // Fetch employee data from the backend
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api2/auth/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  // Filter employees based on search query
  const filterEmployees = (query) => {
    setSearchQuery(query.toLowerCase());
    setFilteredEmployees(
      employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.employeeId.toLowerCase().includes(query) ||
          employee.category.toLowerCase().includes(query)
      )
    );
  };

  // Update weekoff schedule for an employee
  const updateWeekoffSchedule = async (employeeId, weekoffDays) => {
    try {
      const response = await axios.put(
        `${baseUrl}/api2/update-weekoff/${employeeId}`,
        { weekoffDays },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        alert('Weekoff schedule updated successfully');
        fetchEmployeeData(); // Refresh the list after updating
      } else {
        alert(`Failed to update weekoff schedule: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating weekoff schedule:', error);
    }
  };

  // Show dialog for updating weekoff schedule
  const showUpdateWeekoffDialog = (employee) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const initialSelectedWeekoffDays = employee.weekoffSchedule;

    // Set the selected weekoff days when dialog is shown
    setSelectedWeekoffDays(initialSelectedWeekoffDays);
    setCurrentEmployee(employee);
    setShowModal(true); // Open the modal
  };

  const toggleDaySelection = (day) => {
    setSelectedWeekoffDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleUpdate = () => {
    if (currentEmployee) {
      updateWeekoffSchedule(currentEmployee.employeeId, selectedWeekoffDays);
      setShowModal(false); // Close the modal
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Weekoff Management</h1>

      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search by name, ID, or category"
        value={searchQuery}
        onChange={(e) => filterEmployees(e.target.value)}
        className="mb-4"
      />

      <div className="row">
        {filteredEmployees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          filteredEmployees.map((employee) => (
            <div key={employee.employeeId} className="col-md-4 mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{employee.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Employee ID: {employee.employeeId}</Card.Subtitle>
                  <Card.Text>Category: {employee.category}</Card.Text>
                  <Card.Text>Weekoff Schedule: {employee.weekoffSchedule.join(', ')}</Card.Text>
                  <Button variant="primary" onClick={() => showUpdateWeekoffDialog(employee)}>
                    Update Weekoff
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Modal for updating weekoff schedule */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Weekoff for {currentEmployee?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Form.Check
              type="checkbox"
              key={day}
              label={day}
              checked={selectedWeekoffDays.includes(day)}
              onChange={() => toggleDaySelection(day)}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update Weekoff
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WeekoffManagementScreen;
