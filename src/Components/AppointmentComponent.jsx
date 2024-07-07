import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AppointmentComponent = () => {
  const [appointment, setAppointment] = useState({
    title: '',
    date: '',
    description: '',
  });

  const [appointments, setAppointments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const handleCreateAppointment = () => {
    fetch('https://ma-ney3.onrender.com/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointment),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create appointment');
        }
        return response.json();
      })
      .then((data) => {
        setAppointments((prevAppointments) => [...prevAppointments, data]);
        setAppointment({
          title: '',
          date: '',
          description: '',
        });
        Swal.fire('Appointment Created!', 'Appointment has been created successfully.', 'success');
      })
      .catch((error) => {
        console.error('Error creating appointment:', error);
        Swal.fire('Error!', 'An error occurred while creating the appointment.', 'error');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <div className="mb-4">
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="title"
          value={appointment.title}
          onChange={handleChange}
          placeholder="Appointment Title"
        />
        <input
          type="datetime-local"
          className="border rounded-md p-2 mr-2"
          name="date"
          value={appointment.date}
          onChange={handleChange}
          placeholder="Appointment Date"
        />
        <textarea
          className="border rounded-md p-2 mr-2"
          name="description"
          value={appointment.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleCreateAppointment}
        >
          Create Appointment
        </button>
      </div>
      <h3 className="text-lg font-bold mb-2">Upcoming Appointments</h3>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id} className="border rounded-md p-2 mb-2">
            <p><strong>Title:</strong> {appointment.title}</p>
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
            <p><strong>Description:</strong> {appointment.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentComponent;
