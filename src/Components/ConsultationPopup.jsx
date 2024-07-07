import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { SiConsul } from "react-icons/si";

const ConsultationPopup = ({ onClose, startTime }) => {
  const currentTime = new Date();
  const sessionStartTime = new Date(startTime);
  const timeRemaining = Math.floor(
    (sessionStartTime - currentTime) / (1000 * 60)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
      <div className="relative w-[500px] h-96 bg-white rounded-xl shadow p-10">
        {/* Close icon in the top-right corner */}
        <Link to="#" className="absolute top-4 right-4">
          <AiOutlineClose
            onClick={onClose}
            className="text-gray-500 cursor-pointer"
          />
        </Link>
        <div className="flex justify-center items-center">
        <SiConsul color="text-gray-500" size='80' />
        </div>
        <div className="mb-4">
          <p className="text-slate-700 text-md font-medium font-['Lato'] text-center mt-12">
          Your appointment has been made
          </p>
        </div>

        <div className="flex justify-center items-center">
          <Link to="/app">
            <button className="w-96 h-12 bg-slate-700 text-white rounded-lg font-normal font-['Lato'] mt-9">
              Go To appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPopup;
