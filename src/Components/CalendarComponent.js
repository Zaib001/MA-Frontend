import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CalendarComponent = () => {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const user = useSelector((state) => state.user._id);

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => res.json())
      .then((data) => setBookedAppointments(data))
      .catch((error) => console.error('Error fetching appointments:', error));
  }, []);

  return (
    <div className="calendar-container">
      <h2>Booked Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Customer Name</th>
          </tr>
        </thead>
        <tbody>
          {bookedAppointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.customerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarComponent;
