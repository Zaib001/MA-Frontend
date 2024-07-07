import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { signout } from "../api/internal";
import { resetUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await signout();
    dispatch(resetUser());
    navigate("/");
  };

  return (
    <>
      {isAuth && (
        <div className="fixed top-0 right-0 m-4">
          <div
            onClick={toggleDropdown}
            className="text-xl bg-transparent text-slate-600 cursor-pointer border-2 border-gray-300 rounded p-1"
          >
            <FaUser />
          </div>
          {isDropdownOpen && (
            <div className="absolute bg-white shadow-md p-4 w-[183px] sm:w-[200px] top-10 right-2">
              <div
                onClick={handleLogout}
                className="cursor-pointer flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </div>
     
            </div>
          )}
        </div>
      )}
      <div className="bg-white shadow rounded-xl flex-grow p-4 ml-4 md:ml-0 md:w-full">
        <Outlet />
      </div>
    </>
  );
};

export default MainContent;
