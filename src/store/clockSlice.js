import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchClockInStatus = createAsyncThunk(
  'clock/fetchClockInStatus',
  async () => {
    const response = await fetch('https://ma-ney3.onrender.com/api/clock/status');
    return response.json();
  }
);

export const clockIn = createAsyncThunk('clock/clockIn', async (employeeId) => {
  const response = await fetch('https://ma-ney3.onrender.com/api/clock/clock-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeId }),
  });
  return response.json();
});

export const clockOut = createAsyncThunk('clock/clockOut', async (employeeId) => {
  const response = await fetch('https://ma-ney3.onrender.com/api/clock/clock-out', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ employeeId }),
  });
  return response.json();
});

const clockSlice = createSlice({
  name: 'clock',
  initialState: {
    status: 'idle',
    clockInStatus: {},
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClockInStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clockInStatus = action.payload.status;
      })
      .addCase(clockIn.fulfilled, (state, action) => {
        state.clockInStatus[action.meta.arg] = 'clocked_in';
      })
      .addCase(clockOut.fulfilled, (state, action) => {
        state.clockInStatus[action.meta.arg] = 'clocked_out';
      })
      .addCase(fetchClockInStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default clockSlice.reducer;
