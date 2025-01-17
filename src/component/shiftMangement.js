import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap"; // Using React Bootstrap for styling
import logo from "../logo.png";

const ShiftManagement = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center" style={{ marginTop: "50px" }}>
      <Row className="justify-content-center">
        <Col xs={12}>
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="text-center mt-4 name">
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#186BE9", // Color similar to the original
              }}
            >
              Advancetech Solutions
            </h2>
          </div>
        </Col>
      </Row>

      <Row className="mt-5 justify-content-center">
        <Col xs={12} md={8}>
          <div
            className="d-flex justify-content-center align-items-center mb-4"
            style={{ fontSize: "22px", fontWeight: "bold" }}
          >
            <i
              className="bi bi-gear-fill"
              style={{ fontSize: "32px", color: "black", marginRight: "8px" }}
            ></i>
            <span>Manage Shift</span>
          </div>

          <Button
            variant="success"
            size="lg"
            className="w-100 mb-3"
            onClick={() => navigate("/newShift")} // Navigate to /newShift
            style={{ padding: "15px", fontWeight: "bold", fontSize: "16px" }}
          >
            <i
              className="bi bi-plus-circle-fill"
              style={{ marginRight: "10px" }}
            ></i>
            Create Shift
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="w-100 mb-3"
            onClick={() => navigate("/allotShift")} // Navigate to /allotShift
            style={{ padding: "15px", fontWeight: "bold", fontSize: "16px" }}
          >
            <i
              className="bi bi-clipboard-check"
              style={{ marginRight: "10px" }}
            ></i>
            Allot Shift
          </Button>

          {/* New Button for Manage Shifts */}
          <Button
            variant="info"
            size="lg"
            className="w-100"
            onClick={() => navigate("/manageShift")} // Navigate to /manageShift
            style={{ padding: "15px", fontWeight: "bold", fontSize: "16px" }}
          >
            <i
              className="bi bi-list-task"
              style={{ marginRight: "10px" }}
            ></i>
            View & Manage Shifts
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ShiftManagement;
