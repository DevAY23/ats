import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Loginform from './component/Loginform'; // Import the Loginform component
import AdminDashboard from './component/adminDashboard'; // Import AdminDashboard
import ManageEmployee from './component/manageEmployee'; // Import Employee Dashboard
import EmployeeList from './component/employeeList'; // Import the Employee List component
import AttendanceReport from './component/attendanceReport'; // Import the Attendance Report component
import AllotOffice from './component/allotOffice'; // Import the AllotOffice component
import OfficeManagement from './component/officeMangement';
import ViewOffice from './component/viewOffice';
import GenerateReports from './component/generateReports'; // Import the GenerateReports component
import OfficeLocation from './component/officeLocation'; // Import the officelocation component
import SalaryManagementScreen from './component/salaryManagement'; // Import Salary Management Screen
import EmployeeSalaryPage from './component/salaryPage'; // Import Employee Salary Page
import ShiftManagement from './component/shiftMangement'; // Import shift management
import NewShift from './component/newShift'; // Import shift management
import AllotShiftScreen from "./component/allotShift";
import ManageShift from "./component/manageShift";
import LeaveManagement from "./component/leaveManagement";
import useAutoLogout from './component/autoLogout'; // Import the useAutoLogout hook
import PrivateRoute from './component/privateRoute'; // Import the PrivateRoute component
import './App.css';

function App() {
  useAutoLogout(); // Use the hook for auto logout functionality

  return (

    <Routes>
      <Route path="/" element={<Loginform />} /> {/* The login form will be shown at the root path */}

      {/* Protect all the routes below with PrivateRoute */}
      <Route
        path="/adminDashboard"
        element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
      />
      <Route
        path="/manageEmployee"
        element={<PrivateRoute><ManageEmployee /></PrivateRoute>}
      />
      <Route
        path="/employeeList"
        element={<PrivateRoute><EmployeeList /></PrivateRoute>}
      />
      <Route
        path="/attendanceReport"
        element={<PrivateRoute><AttendanceReport /></PrivateRoute>}
      />
      <Route
        path="/officeManagement"
        element={<PrivateRoute><OfficeManagement /></PrivateRoute>}
      />
      <Route
        path="/allotOffice"
        element={<PrivateRoute><AllotOffice /></PrivateRoute>}
      />
      <Route
        path="/generateReports"
        element={<PrivateRoute><GenerateReports /></PrivateRoute>}
      />
      <Route
        path="/officeLocation"
        element={<PrivateRoute><OfficeLocation /></PrivateRoute>}
      />
      <Route
        path="/viewOffice"
        element={<PrivateRoute><ViewOffice /></PrivateRoute>}
      />
      <Route
        path="/salaryPage"
        element={<PrivateRoute><EmployeeSalaryPage /></PrivateRoute>}
      />
      <Route
        path="/salaryManagement"
        element={<PrivateRoute><SalaryManagementScreen /></PrivateRoute>}
      />
      <Route
        path="/shiftManagement"
        element={<PrivateRoute><ShiftManagement /></PrivateRoute>}
      />
      <Route
        path="/newShift"
        element={<PrivateRoute><NewShift /></PrivateRoute>}
      />
      <Route
        path="/allotShift"
        element={<PrivateRoute><AllotShiftScreen /></PrivateRoute>}
      />
      <Route
        path="/manageShift"
        element={<PrivateRoute><ManageShift /></PrivateRoute>}
      />
      <Route
        path="/leaveManagement"
        element={<PrivateRoute><LeaveManagement /></PrivateRoute>}
      />
    </Routes>
  );
}

export default App;
