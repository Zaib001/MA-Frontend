import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clockIn, clockOut, fetchClockInStatus } from '../store/clockSlice';

const ClockIn = () => {
  const dispatch = useDispatch();
  const clockInStatus = useSelector((state) => state.clock.status);
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    dispatch(fetchClockInStatus());
  }, [dispatch]);

  useEffect(() => {
    setClockedIn(clockInStatus === 'clocked_in');
  }, [clockInStatus]);

  const handleClockIn = () => {
    dispatch(clockIn());
  };

  const handleClockOut = () => {
    dispatch(clockOut());
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Clock In/Out</h3>
      <button
        onClick={clockedIn ? handleClockOut : handleClockIn}
        className={`bg-${clockedIn ? 'red' : 'green'}-500 text-white px-4 py-2 rounded-md`}
      >
        {clockedIn ? 'Clock Out' : 'Clock In'}
      </button>
    </div>
  );
};

export default ClockIn;
