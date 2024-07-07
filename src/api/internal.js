import axios from "axios";

const api = axios.create({
  baseURL: "https://ma-ney3.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  try {
    const res = await api.post("/api/login", data); 
    return res;
  } catch (error) {
    console.error("Error during login:", error.response.data.message);
    return error;
  }
};

export const signup = async (data) => {
  try {
    const response = await api.post("/api/register", data);
    return response;
  } catch (error) {
    console.error("Signup Error:", error.response);
    return error;
  }
};

export const getAllOppitmentsbyID = async (userId) => {
  let response;

  try {
    response = await api.get(`/api/user/${userId}/appointments`);
  } catch (error) {}

  return response;
};

export const addProfiledata = async (data) => {
  let response;

  try {
    response = await api.post("/api/addprofile" , data);
  } catch (error) {
    console.error("book-appointment Error:", error.response);
    return error;
  }

  return response;
};

export const submitOppitments = async (data) => {
  try {
    const response = await api.post("/api/book-appointment", data);
    return response;
  } catch (error) {
    console.error("book-appointment Error:", error.response);
    return error;
  }
};

export const getBookedAppointments = async (userId) => {
  let response;

  try {
    response = await api.get(`/api/user/${userId}/booked-appointments`);
  } catch (error) {}

  return response;
};

export const signout = async () => {
  let response;
  try {
    response = await api.post("/api/logout");
  } catch (error) {
    return error;
  }

  return response;
};

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalReq = error.config;

    const errorMessage = error.response && error.response.data && error.response.data.message;

    if (
      errorMessage === 'Unauthorized' &&
      (error.response.status === 401 || error.response.status === 500) &&
      originalReq &&
      !originalReq._isRetry
    ) {
      originalReq._isRetry = true;

      try {
        await axios.get(`https://ma-ney3.onrender.com/api/refresh`, {
          withCredentials: true,
        });

        return api.request(originalReq);
      } catch (error) {
        return error;
      }
    }
    throw error;
  }
);