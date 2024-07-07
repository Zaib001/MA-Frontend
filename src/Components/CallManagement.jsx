import React, { useState } from 'react';
import Swal from 'sweetalert2';
import AppointmentComponent from './AppointmentComponent'; // Import the AppointmentComponent

const CallManagement = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    address: '', // Add the address field
  });

  const [showAppointment, setShowAppointment] = useState(false); // Add a state to show/hide the appointment component

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevCustomerInfo) => ({
      ...prevCustomerInfo,
      [name]: value,
    }));
  };

  const handleCall = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to handle this call?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, handle it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('https://ma-ney3.onrender.com/api/make-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipient: customerInfo.phone }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to handle call');
            }
            return response.text();
          })
          .then((data) => {
            console.log('Call handled:', data);
            Swal.fire(
              'Call Handled!',
              'The call has been successfully handled.',
              'success'
            );
            setShowAppointment(true); // Show the appointment component after handling the call
          })
          .catch((error) => {
            console.error('Error handling call:', error);
            Swal.fire(
              'Error!',
              'An error occurred while handling the call.',
              'error'
            );
          });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 h-900">
      <h2 className="text-2xl font-bold mb-4">Call Handling</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-bold">Name:</label>
          <input
            type="text"
            name="name"
            value={customerInfo.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">Phone:</label>
          <input
            type="text"
            name="phone"
            value={customerInfo.phone}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block mb-2 font-bold">Email:</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block mb-2 font-bold">Notes:</label>
          <textarea
            name="notes"
            value={customerInfo.notes}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            rows="3"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 font-bold">Address:</label>
        <textarea
          name="address"
          value={customerInfo.address}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          rows="3"
        />
      </div>
      <button
        onClick={handleCall}
        className="mt-8 bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 focus:outline-none focus:ring focus:ring-slate-400"
      >
        Handle Call
      </button>
      {showAppointment && (
        <AppointmentComponent
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
          showAppointment={showAppointment}
          setShowAppointment={setShowAppointment}
        />
      )}
    </div>
  );
};

export default CallManagement;
