// BookAppointmentRoutes.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AppointmentComponent from './AppointmentComponent';

const Routes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<AppointmentComponent />}
      />
    </Routes>
  );
};

export default Routes;
