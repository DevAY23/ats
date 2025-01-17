import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';  // Importing date-fns for time formatting

const AllGenerateReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_SECRET_KEY;
  const apiUrl = `${baseUrl}/api2/attendance/all-reports`;

  const fetchAndGenerateAllReports = async () => {
    setIsLoading(true);

    try {
      // Fetch data from the API
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const attendanceData = await response.json();

        if (attendanceData.length === 0) {
          alert('No attendance records found');
          return;
        }

        // Prepare data for the Excel sheet
        const headers = [
          'Employee ID',
          'Name',
          'Date',
          'Check-In Time',
          'Check-Out Time',
          'Hours Worked',
          'Overtime Hours',
          'Undertime Hours',
          'Shift Name',
        ];

        // Prepare rows for each employee's data
        const rows = attendanceData.map((row) => {
          // Formatting the check-in and check-out times to AM/PM format
          const formattedCheckInTime = row.checkInTime
            ? format(new Date(row.checkInTime), 'hh:mm:ss a')  // AM/PM format
            : 'N/A';
          const formattedCheckOutTime = row.checkOutTime
            ? format(new Date(row.checkOutTime), 'hh:mm:ss a')  // AM/PM format
            : 'N/A';

          return [
            row.employeeId,
            row.name,
            row.date,
            formattedCheckInTime,
            formattedCheckOutTime,
            row.hoursWorked ?? 'N/A',
            row.overtimeHours ?? '0',
            row.underTimeHours ?? '0',
            row.shiftName ?? 'N/A',
          ];
        });

        // Create a worksheet and add the headers and rows
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

        // Write the Excel file to a Blob
        const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelFile], { type: 'application/octet-stream' });

        // Save the file using file-saver
        saveAs(blob, 'All_Attendance_Report.xlsx');
      } else {
        alert('Error fetching attendance records');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Generate All Attendance Reports</h2>

      <div className="text-center">
        <button
          onClick={fetchAndGenerateAllReports}
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Generating...
            </>
          ) : (
            'Generate and Download Report'
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p>
          Click the button above to generate the report for all attendance records and download it as an Excel file.
        </p>
      </div>
    </div>
  );
};

export default AllGenerateReports;
