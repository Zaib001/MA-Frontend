import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const SMSNotifications = () => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message') setMessage(value);
    else if (name === 'recipient') setRecipient(value);
  };

  const handleSendSMS = async () => {
    try {
      const response = await axios.post('https://ma-ney3.onrender.com/send-sms', {
        recipient,
        message
      });

      Swal.fire(
        'SMS Sent!',
        'The SMS has been successfully sent.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error!',
        'Failed to send SMS. Please try again later.',
        'error'
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">SMS Notifications</h2>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Recipient:</label>
        <input
          type="text"
          name="recipient"
          value={recipient}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full border rounded px-4 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-bold">Message:</label>
        <textarea
          name="message"
          value={message}
          onChange={handleChange}
          placeholder="Enter message"
          className="w-full border rounded px-4 py-2"
          rows="4"
        />
      </div>
      <button
        onClick={handleSendSMS}
        className="bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 focus:outline-none focus:ring focus:ring-slate-400"
      >
        Send SMS
      </button>
    </div>
  );
};

export default SMSNotifications;
