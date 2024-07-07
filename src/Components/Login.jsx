import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loginSchema from "../Schema/Loginschema";
import { useFormik } from "formik";
import { login } from "../api/internal";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
  });
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const data = {
      email: values.email,
      password: values.password,
    };

    const response = await login(data);
    console.log(response.data.user);
    if (response.status === 200) {
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        auth: response.data.auth,
      };

      dispatch(setUser(user));
      navigate("/app");
    } else if (response.code === "ERR_BAD_REQUEST") {
      setError(response.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-xl shadow bg-white">
        <img
          src={logo}
          alt="logo"
          className="flex w-36 ml-[120px] justify-center items-center"
        />
        <br />
        <div className="mb-4 text-center text-slate-700 text-2xl font-bold font-Lato">
          Sign In
          <br />
        </div>
        <span className="flex justify-center items-center text-center font-semibold">
          To Continue Sign In
        </span>
        <br />
        <hr />
        <br />
        <div className="mb-4">
          <label className="text-slate-700 text-xs font-normal font-Lato block">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full h-10 px-4 border rounded-lg focus:outline-none focus:border-slate-700 ${
              errors.email && touched.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && touched.email && (
            <div className="text-red-500 text-xs mt-1 font-normal font-Lato">
              {errors.email}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="text-slate-700 text-xs font-normal font-Lato block">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full h-10 px-4 border rounded-lg focus:outline-none focus:border-slate-700 ${
              errors.password && touched.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && touched.password && (
            <div className="text-red-500 text-xs mt-1 font-normal font-Lato">
              {errors.password}
            </div>
          )}
        </div>

        <button
          onClick={handleLogin}
          className="w-full h-12 bg-pink-400 text-white rounded-lg font-normal font-Lato"
        >
          Login
        </button>
        <div className="mb-6 text-center">
          <span className="text-slate-700 text-xs font-normal font-Lato">
            Create an Account? {"           "}
          </span>
          <Link to="/registeruser">
            <span className="text-slate-700 text-xs font-Lato font-bold">
              Sign Up | Forget Password
            </span>
          </Link>
        </div>
        {error && (
          <div className="text-red-500 text-sm font-normal font-Lato mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
