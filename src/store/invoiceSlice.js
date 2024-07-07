import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async () => {
    const response = await fetch('https://ma-ney3.onrender.com/api/invoices');
    return response.json();
  }
);

export const addInvoice = createAsyncThunk(
  'invoices/addInvoice',
  async (newInvoice) => {
    const response = await fetch('https://ma-ney3.onrender.com/api/invoices/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInvoice),
    });
    return response.json();
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoices = action.payload;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.invoices.push(action.payload);
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
