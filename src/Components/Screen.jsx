import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoPersonOutline,
  IoCalendarOutline,
} from "react-icons/io5";

import MainContent from "./MainContent";
import {  useSelector } from "react-redux";

const YourSidebarComponent = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const location = useLocation();
  const langState = useSelector((state) => state.user.lang);
  const isActive = (pathname) => location.pathname === pathname;

  const linkClass = (pathname) => {
    return `mb-2 cursor-pointer p-2 text-slate-700 rounded transition ${
      isActive(pathname) ? "bg-gray-300" : "hover:bg-gray-200"
    } ${!isAuth ? "pointer-events-none opacity-50" : ""}`;
  };



  return (
    
    <div className="flex flex-col md:flex-row h-screen gap-4">
      <div className="bg-white shadow rounded-xl w-full md:w-64 lg:w-72 xl:w-96 px-8 md:px-4 lg:px-6 xl:px-8 py-4 md:py-6 lg:py-8 xl:py-10">
        <ul className="mt-8">
          <li
            className={linkClass("/")}
          >
            <Link to="/app">
              <div className="flex items-center space-x-6">
                <IoHomeOutline className="text-xl opacity-[0.5]" />
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
               Home
                  </span>
              </div>
            </Link>
          </li>
          <li
            className={linkClass("")}
          >
            <Link to="call">
              <div className="flex items-center space-x-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    opacity="0.5"
                    d="M3.5 12.5H9.5V11.5H3.5V12.5ZM3.5 8.5H12.5V7.5H3.5V8.5ZM3.5 4.5H12.5V3.5H3.5V4.5ZM1.615 16C1.155 16 0.771 15.846 0.463 15.538C0.154333 15.2293 0 14.845 0 14.385V1.615C0 1.155 0.154333 0.771 0.463 0.463C0.771 0.154333 1.155 0 1.615 0H14.385C14.845 0 15.229 0.154333 15.537 0.463C15.8457 0.771 16 1.155 16 1.615V14.385C16 14.845 15.846 15.229 15.538 15.537C15.2293 15.8457 14.845 16 14.385 16H1.615ZM1.615 15H14.385C14.5383 15 14.6793 14.936 14.808 14.808C14.936 14.6793 15 14.5383 15 14.385V1.615C15 1.46167 14.936 1.32067 14.808 1.192C14.6793 1.064 14.5383 1 14.385 1H1.615C1.46167 1 1.32067 1.064 1.192 1.192C1.064 1.32067 1 1.46167 1 1.615V14.385C1 14.5383 1.064 14.6793 1.192 14.808C1.32067 14.936 1.46167 15 1.615 15Z"
                    fill="#344767"
                  />
                </svg>
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
                Call Management
                  </span>
              </div>
            </Link>
          </li>
      
          <li
            className={linkClass("")}
          >
            <Link to="sms">
              <div className="flex items-center space-x-6">
                <IoPersonOutline className="text-xl opacity-[0.5]" />
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
                Sms Management
                  </span>
              </div>
            </Link>
          </li>
          <li
            className={linkClass("")}
          >
            <Link to="profile">
              <div className="flex items-center space-x-6">
                <IoCalendarOutline className="text-xl opacity-[0.5]" />
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
               Book appointment
                  </span>
              </div>
            </Link>
          </li>
          <li
            className={linkClass("")}
          >
            <Link to="invoice">
              <div className="flex items-center space-x-6">
                <IoCalendarOutline className="text-xl opacity-[0.5]" />
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
                Estimates And Invoices
                  </span>
              </div>
            </Link>
          </li>
          <li
            className={linkClass("")}
          >
            <Link to="job">
              <div className="flex items-center space-x-6">
                <IoCalendarOutline className="text-xl opacity-[0.5]" />
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
               Job Tracking
                  </span>
              </div>
            </Link>
          </li>
          <li
            className={linkClass("")}
          >
            <Link to="addEmploye">
              <div className="flex items-center space-x-6">
                <IoCalendarOutline className="text-xl opacity-[0.5]" />
                <span className="opacity-50 text-slate-700 text-[15px] font-normal font-['Lato']">
              Add Employee
                  </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default YourSidebarComponent;
