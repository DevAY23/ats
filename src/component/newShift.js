import React, { useState } from "react";
import axios from "axios";

const CreateShift = () => {
  const [shiftName, setShiftName] = useState("");
  const [description, setDescription] = useState("");
  const [shiftStart, setShiftStart] = useState({ hour: "10", minute: "00", period: "AM" });
  const [shiftEnd, setShiftEnd] = useState({ hour: "06", minute: "00", period: "PM" });

  const formatTime = ({ hour, minute, period }) => `${hour}:${minute} ${period}`;

  const handleTimeChange = (type, field, value) => {
    if (type === "start") {
      setShiftStart((prev) => ({ ...prev, [field]: value }));
    } else {
      setShiftEnd((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!shiftName || !description || !shiftStart || !shiftEnd) {
      alert("All fields are required.");
      return;
    }

    const formattedStart = formatTime(shiftStart); // e.g., "10:00 AM"
    const formattedEnd = formatTime(shiftEnd); // e.g., "06:00 PM"

    const baseUrl = process.env.REACT_APP_SECRET_KEY;

    try {
      const response = await axios.post(
        `${baseUrl}/api2/Shift/register-Shift`,
        {
          shiftName,
          shiftStart: formattedStart,
          shiftEnd: formattedEnd,
          description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Shift added successfully!");
        setShiftName("");
        setDescription("");
        setShiftStart({ hour: "10", minute: "00", period: "AM" });
        setShiftEnd({ hour: "06", minute: "00", period: "PM" });
      } else {
        alert("Failed to add shift. Please try again.");
      }
    } catch (error) {
      console.error("Error adding shift:", error);
      alert("Error: Could not connect to the server.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Shift</h2>
      <div className="form-group mb-3">
        <label className="form-label">Shift Name:</label>
        <input
          type="text"
          value={shiftName}
          onChange={(e) => setShiftName(e.target.value)}
          className="form-control"
          placeholder="Enter shift name"
        />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Shift Start:</label>
        <div className="d-flex">
          <select
            value={shiftStart.hour}
            onChange={(e) => handleTimeChange("start", "hour", e.target.value)}
            className="form-select me-1"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <option key={hour} value={hour}>
                {hour} {/* No padding for single-digit hours */}
              </option>
            ))}
          </select>
          <select
            value={shiftStart.minute}
            onChange={(e) => handleTimeChange("start", "minute", e.target.value)}
            className="form-select me-1"
          >
            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
              <option key={minute} value={minute.toString().padStart(2, "0")}>
                {minute.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <select
            value={shiftStart.period}
            onChange={(e) => handleTimeChange("start", "period", e.target.value)}
            className="form-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Shift End:</label>
        <div className="d-flex">
          <select
            value={shiftEnd.hour}
            onChange={(e) => handleTimeChange("end", "hour", e.target.value)}
            className="form-select me-1"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <option key={hour} value={hour}>
                {hour} {/* No padding for single-digit hours */}
              </option>
            ))}
          </select>
          <select
            value={shiftEnd.minute}
            onChange={(e) => handleTimeChange("end", "minute", e.target.value)}
            className="form-select me-1"
          >
            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
              <option key={minute} value={minute.toString().padStart(2, "0")}>
                {minute.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <select
            value={shiftEnd.period}
            onChange={(e) => handleTimeChange("end", "period", e.target.value)}
            className="form-select"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          placeholder="Enter shift description"
        ></textarea>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary btn-lg w-100">
        Add Shift
      </button>
    </div>
  );
};

export default CreateShift;
