import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Async thunks for fetching and adding employees
export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await axios.get('https://ma-ney3.onrender.com/api/employees');
  return response.data;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee) => {
  const response = await axios.post('https://ma-ney3.onrender.com/api/employees/create', employee);
  return response.data;
});

const initialState = {
  employees: [],
  employeeNames: {}, // Added state to store employee names
  status: 'idle',
  error: null
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    updateEmployee: (state, action) => {
      const updatedEmployee = action.payload;
      const index = state.employees.findIndex(employee => employee._id === updatedEmployee._id);
      if (index !== -1) {
        state.employees[index] = updatedEmployee;
      }
    },
    deleteEmployee: (state, action) => {
      const id = action.payload;
      state.employees = state.employees.filter(employee => employee._id !== id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
        // Update employeeNames here as well
        state.employeeNames = action.payload.reduce((acc, employee) => {
          acc[employee._id] = employee.name;
          return acc;
        }, {});
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
        // Update employeeNames when adding new employee
        state.employeeNames[action.payload._id] = action.payload.name;
      });
  }
});

export const { updateEmployee, deleteEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
