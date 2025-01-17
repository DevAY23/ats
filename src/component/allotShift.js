import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllotShiftScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [employeeShifts, setEmployeeShifts] = useState({});
  const [shiftFormOpen, setShiftFormOpen] = useState({}); // Track which employee's form is open
  const [shiftAssignmentSuccess, setShiftAssignmentSuccess] = useState({}); // Track successful shift assignment

  useEffect(() => {
    fetchEmployees();
    fetchShifts();
  }, []);

  const baseUrl = process.env.REACT_APP_SECRET_KEY;

  const fetchEmployees = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await axios.get(`${baseUrl}/api2/auth/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api2/Shift/all-shifts`);
      setShifts(response.data);
    } catch (error) {
      console.error('Failed to load shifts', error);
    }
  };

  const allotShift = async (employeeId) => {
    const employeeShiftList = employeeShifts[employeeId];

    if (!employeeShiftList || employeeShiftList.length === 0) {
      alert('Please assign at least one shift');
      return;
    }

    let allShiftsAssigned = true;

    for (const assignment of employeeShiftList) {
      const { shiftId, fromDate, toDate } = assignment;

      if (!shiftId || !fromDate || !toDate) {
        alert('Please fill in all the fields before assigning a shift');
        allShiftsAssigned = false;
        break;
      }

      // Fetch shift details from the server
      const selectedShift = shifts.find((shift) => shift._id === shiftId);
      if (!selectedShift) {
        alert('Selected shift is invalid');
        allShiftsAssigned = false;
        break;
      }

      const { shiftName, shiftStart, shiftEnd } = selectedShift;

      try {
        const response = await axios.post(`${baseUrl}/api2/Shift/assign-shift`, {
          employeeId,
          shiftId,
          shiftName,
          shiftStart,
          shiftEnd,
          fromDate,
          toDate,
        });

        if (response.status !== 201) {
          const errorMessage = response.data.message;
          alert(`Failed to assign shift: ${errorMessage}`);
          allShiftsAssigned = false;
        }
      } catch (error) {
        console.error('Failed to assign shift', error);
        allShiftsAssigned = false;
      }
    }

    if (allShiftsAssigned) {
      alert('All shifts assigned successfully');
      setShiftAssignmentSuccess((prev) => ({ ...prev, [employeeId]: true }));
      setEmployeeShifts((prevShifts) => ({
        ...prevShifts,
        [employeeId]: [],
      }));
    }
  };

  const addShiftForEmployee = (employeeId) => {
    setEmployeeShifts((prevShifts) => ({
      ...prevShifts,
      [employeeId]: [
        ...(prevShifts[employeeId] || []),
        {
          shiftId: '',
          fromDate: '',
          toDate: '',
        },
      ],
    }));
    setShiftFormOpen((prev) => ({ ...prev, [employeeId]: true })); // Open the form for the employee
  };

  const handleShiftChange = (employeeId, index, field, value) => {
    setEmployeeShifts((prevShifts) => {
      const updatedShifts = [...(prevShifts[employeeId] || [])];
      updatedShifts[index] = { ...updatedShifts[index], [field]: value };
      return { ...prevShifts, [employeeId]: updatedShifts };
    });
  };

  const closeShiftForm = (employeeId) => {
    setEmployeeShifts((prevShifts) => ({
      ...prevShifts,
      [employeeId]: [], // Remove the shift data for the employee to close the form
    }));
    setShiftFormOpen((prev) => ({ ...prev, [employeeId]: false })); // Close the form for the employee
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Allot Multiple Shifts</h1>
      {employees.map((employee) => {
        const employeeId = employee.employeeId;
        return (
          <div key={employeeId} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h4>{`${employee.name} (ID: ${employeeId})`}</h4>
              {shiftFormOpen[employeeId] && !shiftAssignmentSuccess[employeeId] && (
                <button
                  onClick={() => closeShiftForm(employeeId)}
                  className="btn btn-danger position-absolute top-0 end-0 m-2"
                  style={{ zIndex: 10 }}
                >
                  <span>&times;</span>
                </button>
              )}
              {employeeShifts[employeeId]?.map((assignment, index) => (
                <div key={index} className="shift-assignment mb-3">
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <label>Shift</label>
                      <select
                        className="form-select"
                        value={assignment.shiftId}
                        onChange={(e) => handleShiftChange(employeeId, index, 'shiftId', e.target.value)}
                      >
                        <option value="">Select Shift</option>
                        {shifts.map((shift) => (
                          <option key={shift._id} value={shift._id}>
                            {shift.shiftName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label>From Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={assignment.fromDate}
                        onChange={(e) => handleShiftChange(employeeId, index, 'fromDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={assignment.toDate}
                        onChange={(e) => handleShiftChange(employeeId, index, 'toDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-primary me-2" onClick={() => addShiftForEmployee(employeeId)}>
                Add Shift
              </button>
              <button className="btn btn-success" onClick={() => allotShift(employeeId)}>
                Allot Shifts
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllotShiftScreen;
