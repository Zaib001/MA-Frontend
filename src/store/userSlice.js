import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  email: "",
  auth: false,
  token: "",
  lang: "en"
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, email, auth, token } = action.payload;

      state._id = _id;
      state.email = email;
      state.auth = auth;
      state.token = token;
    },
    resetUser: (state) => {
      state._id = "";
      state.email = "";
      state.auth = false;
      state.token = ""; // Reset the token
    },
    setLang(state, action) {
      state.lang = action.payload;
    }
  },
});

export const { setUser, resetUser, setLang } = userSlice.actions;

export default userSlice.reducer;
