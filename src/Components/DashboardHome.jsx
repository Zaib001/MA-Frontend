import React, { useEffect, useState } from 'react';
import { IoCalendarOutline } from 'react-icons/io5';
import { getAllOppitmentsbyID } from '../api/internal';
import { useSelector } from "react-redux";
import axios from 'axios';

const statusOptions = [
  "Needs Estimate Sent",
  "Estimate Sent Needs Approval",
  "Approved Estimate",
  "Schedule Job",
  "Job Scheduled",
  "Job Completed Need Invoiced",
  "Invoiced Needs Paid",
  "Paid",
];

const DashboardHome = () => {
  const userId = useSelector((state) => state.user._id);

  const [appointments, setAppointments] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAllOppitmentsbyID(userId);
        if (response && response.status === 200) {
          setAppointments(response.data);
        } else {
          console.error('Error fetching appointments. Response:', response);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://ma-ney3.onrender.com/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchAppointments();
    fetchJobs();
  }, [userId]);

  const summarizeJobsByStatus = (jobs) => {
    const statusSummary = {};
    statusOptions.forEach(status => statusSummary[status] = 0);

    jobs.forEach(job => {
      if (statusSummary.hasOwnProperty(job.status)) {
        statusSummary[job.status] += 1;
      }
    });

    return statusSummary;
  };

  const statusSummary = summarizeJobsByStatus(jobs);

  const formatAppointmentDate = (date) => {
    const currentDate = new Date();
    const appointmentDate = new Date(date);

    if (appointmentDate.toDateString() === currentDate.toDateString()) {
      return 'Today';
    } else {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate() + 1);

      if (appointmentDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        const optionsDate = { weekday: 'long' };
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };

        return appointmentDate.toLocaleDateString('en-US', optionsDate);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-4">
        {appointments.length === 0 ? (
          <div className="flex items-center justify-center w-full">
            <p className="text-xl font-light">No appointments scheduled</p>
          </div>
        ) : (
          appointments.map(appointment => (
            <div key={appointment._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-center items-center mb-4">
                  <IoCalendarOutline className="text-8xl mr-2 text-gray-500" />
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-lg font-light">Appointments</span>
                </div>

                <div className="mb-2">
                  <span className="text-xl font-normal flex items-center justify-center">
                    {formatAppointmentDate(appointment.date)}
                  </span>
                  <span className="text-xl font-medium flex items-center justify-center">
                    {appointment.time}
                  </span>
                  <span className="text-lg font-medium flex items-center justify-center">
                    {appointment.customerName}
                  </span>
                  <span className="text-[14px] flex items-center justify-center">
                    {appointment.customerAddress}
                  </span>
                  <span className="font-[7px] flex items-center justify-center">
                    {appointment.customerNotes}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <h3 className="text-2xl font-bold w-full text-center">Job Summary</h3>
        {Object.entries(statusSummary).map(([status, count]) => (
          <div key={status} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <div className="bg-white rounded-xl shadow p-4">
              <h4 className="text-md">{status}</h4>
              <p className="text-md font-bold">{count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
