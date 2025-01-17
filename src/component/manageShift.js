import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Container, Row, Col } from "react-bootstrap";

const ManageShift = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.REACT_APP_SECRET_KEY;

  // Fetch shifts from the backend
  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api2/Shift/all-shifts`);
      setShifts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      setLoading(false);
    }
  };

  // Delete a shift by ID
  const deleteShift = async (shiftId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shift?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${baseUrl}/api2/Shift/delete-shift/${shiftId}`
      );
      if (response.status === 200) {
        alert("Shift deleted successfully!");
        setShifts(shifts.filter((shift) => shift._id !== shiftId));
      } else {
        alert("Failed to delete the shift.");
      }
    } catch (error) {
      console.error("Error deleting shift:", error);
      alert("An error occurred while deleting the shift.");
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h2 className="text-center mb-4">Manage Shifts</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          {loading ? (
            <p>Loading shifts...</p>
          ) : shifts.length > 0 ? (
            <Table bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Shift Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, index) => (
                  <tr key={shift._id}>
                    <td>{index + 1}</td>
                    <td>{shift.shiftName}</td>
                    <td>{shift.shiftStart}</td>
                    <td>{shift.shiftEnd}</td>
                    <td>{shift.description}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteShift(shift._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No shifts available.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ManageShift;
