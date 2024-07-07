import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import employeeReducer from './eSlice';
import invoiceReducer from './invoiceSlice';
import clockReducer from './clockSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    employees: employeeReducer,
    clock: clockReducer,
    invoices: invoiceReducer,
  },
});

export default store;
