import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap"; // Using React Bootstrap for styling
import logo from "../logo.png";

const OfficeManagement = () => {
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
              className="bi bi-building"
              style={{ fontSize: "32px", color: "black", marginRight: "8px" }}
            ></i>
            <span>Manage Office</span>
          </div>

          <Button
            variant="success"
            size="lg"
            className="w-100 mb-3"
            onClick={() => navigate("/officeLocation")} // Navigate to /newOffice
            style={{ padding: "15px", fontWeight: "bold", fontSize: "16px" }}
          >
            <i
              className="bi bi-plus-circle-fill"
              style={{ marginRight: "10px" }}
            ></i>
            Add New Office
          </Button>

          <Button
            variant="primary"
            size="lg"
            className="w-100 mb-3"
            onClick={() => navigate("/allotOffice")} // Navigate to /allotOffice
            style={{ padding: "15px", fontWeight: "bold", fontSize: "16px" }}
          >
            <i
              className="bi bi-person-check"
              style={{ marginRight: "10px" }}
            ></i>
            Allot Office
          </Button>

          {/* New Button for viewOffice */}
          <Button
            variant="info"
            size="lg"
            className="w-100"
            onClick={() => navigate("/viewOffice")} // Navigate to /viewOffice
            style={{ padding: "15px", fontWeight: "bold", fontSize: "16px" }}
          >
            <i
              className="bi bi-building-fill"
              style={{ marginRight: "10px" }}
            ></i>
            View Offices
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default OfficeManagement;
