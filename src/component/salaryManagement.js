import React, { useState, useEffect } from "react"; 
import { useLocation } from "react-router-dom"; 
import axios from "axios"; 
import moment from "moment"; // Import moment for date manipulation

const SalaryManagementScreen = () => {
  const { state } = useLocation();
  const { employee, selectedDate } = state;

  const [salaryDetails, setSalaryDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  // Use moment to calculate start and end dates
  const selectedMoment = moment(selectedDate);
  const startDate = selectedMoment.clone().subtract(1, 'months').add(1, 'days').format('YYYY-MM-DD');
  const endDate = selectedMoment.format('YYYY-MM-DD');


  // Helper function to parse time strings like "02:30:00" to decimal hours
  const parseTimeString = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };

  // Helper function to format total hours into a string like "02:30:00"
  const formatTimeString = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    const seconds = Math.floor(((totalHours - hours) * 60 - minutes) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to fetch and process salary details
  const fetchSalaryDetails = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const baseUrl = `${process.env.REACT_APP_SECRET_KEY}`;

    try {
      
      console.log('Start Date:', startDate);  // Logs 17th January if selectedDate is 16th February
      console.log('End Date:', endDate);  // Logs 16th February

      // Fetch attendance data
      const attendanceResponse = await axios.get(
        `${baseUrl}/api2/salary/attendance?employeeId=${employee.employeeId}`
      );

      const attendanceData = attendanceResponse.data;

      // Filter attendance records based on the calculated date range
      const filteredAttendance = attendanceData.filter((record) => {
        const attendanceDate = moment(record.date).format('YYYY-MM-DD');
        return attendanceDate >= startDate && attendanceDate <= endDate;
      });

      let totalHoursWorked = 0;

      // Calculate total hours worked 
      filteredAttendance.forEach((record) => {
        totalHoursWorked += parseTimeString(record.hoursWorked || "00:00:00");
      });

      // Fetch employee details
      const employeeResponse = await axios.get(
        `${baseUrl}/api2/salary/employees?endDate=${selectedDate}`
      );

      const employeeData = employeeResponse.data.find(
        (emp) => emp.employeeId === employee.employeeId
      );

      if (!employeeData) {
        throw new Error("Employee details not found.");
      }

      // Calculate salary components
      const hourlySalary = parseFloat(employeeData.salary);
      const baseSalary = totalHoursWorked * hourlySalary;
      const grossSalary = baseSalary;

      const employerPf = grossSalary * 0.125;
      const employeePf = grossSalary * 0.12;
      const employerEsic = grossSalary * 0.0325;
      const employeeEsic = grossSalary * 0.0075;

      const totalDeductions = employeePf + employeeEsic;
      const netSalary = grossSalary - totalDeductions;

      // Update state with the computed salary details
      setSalaryDetails({
        hoursWorked: formatTimeString(totalHoursWorked),
        grossSalary: grossSalary.toFixed(2),
        netSalary: netSalary.toFixed(2),
        totalPf: (employerPf + employeePf).toFixed(2),
        totalEsic: (employerEsic + employeeEsic).toFixed(2),
      });

    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch salary details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryDetails();
  }, [employee.employeeId, selectedDate]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center text-primary mb-4">Salary Details</h1>
        <h4 className="text-center text-primary mb-4">Salary from {moment(startDate).format('DD MMM YYYY')} to {moment(endDate).format('DD MMM YYYY')} </h4>

        {isLoading && <div className="text-center">Loading...</div>}
        {errorMessage && (
          <div className="alert alert-danger text-center"><strong>{"No record found"}</strong></div>
        )}

        {salaryDetails && (
          <div>
            <h3 className="text-secondary mb-3">Employee: {employee.name}</h3>
            <table className="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>Total Hours Worked</th>
                  <td>{salaryDetails.hoursWorked}</td>
                </tr>
                <tr className="table-success">
                  <th>Gross Salary</th>
                  <td className="font-weight-bold">₹{salaryDetails.grossSalary}</td>
                </tr>
                <tr>
                  <th>Total PF Payable</th>
                  <td>₹{salaryDetails.totalPf}</td>
                </tr>
                <tr>
                  <th>Total ESIC Payable</th>
                  <td>₹{salaryDetails.totalEsic}</td>
                </tr>
                <tr className="table-success">
                  <th>Net Salary</th>
                  <td className="font-weight-bold">
                    <strong>₹{salaryDetails.netSalary}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryManagementScreen;
