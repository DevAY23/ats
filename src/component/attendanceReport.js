import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const AttendanceReportScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const baseUrl = process.env.REACT_APP_SECRET_KEY;
  const apiUrl = `${baseUrl}/api2/attendance/report`;

  const fetchAndGenerateReport = async () => {
    if (!selectedDate) {
      setShowDateError(true);
      return;
    }
    setShowDateError(false);
    setIsLoading(true);

    try {
      const formattedDate = format(selectedDate, 'EEE MMM dd yyyy');
      const response = await axios.get(`${apiUrl}?date=${formattedDate}`);

      if (response.status === 200) {
        const data = response.data;

        if (data.length === 0) {
          alert('No records found for this date');
        } else {
          generateExcelReport(data, formattedDate);
        }
      } else {
        alert('No records found for this date');
      }
    } catch (error) {
      alert('No records found for this date.');
    } finally {
      setIsLoading(false);
      setShowDatePicker(true);
    }
  };

  const generateExcelReport = (data, formattedDate) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Employee ID",
        "Name",
        "Date",
        "Check-In Time",
        "Check-Out Time",
        "Hours Worked",
        "Overtime Hours",
        "Undertime Hours",
        "Shift Name"
      ]
    ]);

    data.forEach((row) => {
      const formattedCheckInTime = row.checkInTime
        ? format(new Date(row.checkInTime), 'hh:mm:ss a') // AM/PM format
        : 'N/A';
      const formattedCheckOutTime = row.checkOutTime
        ? format(new Date(row.checkOutTime), 'hh:mm:ss a') // AM/PM format
        : 'N/A';
      const hoursWorked = row.hoursWorked ?? 'N/A';
      const overtimeHours = row.overtimeHours ?? '0';
      const undertimeHours = row.underTimeHours ?? '0';
      const shiftName = row.shiftName ?? 'N/A';

      XLSX.utils.sheet_add_aoa(ws, [
        [
          row.employeeId,
          row.name,
          row.date,
          formattedCheckInTime,
          formattedCheckOutTime,
          hoursWorked,
          overtimeHours,
          undertimeHours,
          shiftName
        ]
      ], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { bookType: 'application/octet-stream' });
    saveAs(blob, `Attendance_Report_${formattedDate.replace(/\s/g, '_')}.xlsx`);

    alert('Report generated successfully!');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center text-primary">Attendance Report</h1>

      <div className="mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 className="mb-2">
              {selectedDate ? `Selected Date: ${format(selectedDate, 'dd-MM-yyyy')}` : 'Select a Date'}
            </h5>
          </div>
          <div className="col-md-6">
            {showDatePicker && (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
                dateFormat="dd/MM/yyyy"
                className={`form-control ${showDateError ? 'border-danger' : ''}`}
                placeholderText="Click to select a date"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  padding: '10px',
                }}
              />
            )}
            {showDateError && <small className="text-danger">Please select a date before proceeding.</small>}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}
          onClick={fetchAndGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Generate and Download Report'
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceReportScreen;
