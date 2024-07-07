import React, {lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import './App.css'
import useAutoLogin from "./hooks/useAutoLogin";
import Loader from "./Loader/Loader";
import CallHandling from "./Components/CallManagement";
import SMSNotifications from "./Components/SmsNotification";
import EstimatesAndInvoices from "./Components/Invoice";
import JobTracking from "./Components/JobTracking";
import EmployeeManagement from "./Components/EmployeeManagement";
import InvoiceManagement from "./Components/Invoice";



const Login = lazy(() => import("./Components/Login"));
const Register = lazy(() => import("./Components/Register"));
const ResetPassword = lazy(() => import("./Components/ResetPassword"));
const YourSidebarComponent = lazy(() => import("./Components/Screen"));
const AppointmentComponent = lazy(() => import("./Components/AppointmentComponent"));
const DashboardHome = lazy(() => import("./Components/DashboardHome"));
const AppProfile = lazy(() => import("./Components/AppProfile"));


const App = () => {
  const loading = useAutoLogin();

  return loading ? (
    <Loader text="" />
  ) : (
    <Suspense fallback={<Loader text="" />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registeruser" element={<Register />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/app/*" element={<YourSidebarComponent />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<AppProfile />} />
          <Route path="appointment" element={<AppointmentComponent />} />
          <Route path="job" element={<JobTracking />} />
          <Route path="addEmploye" element={<EmployeeManagement />} />
          <Route path="invoice" element={<InvoiceManagement />} />
          <Route path="sms" element={<SMSNotifications />} />
          <Route path="call" element={<CallHandling />} />
        </Route>
      </Routes>
    </Suspense>
  );
};


export default App;
