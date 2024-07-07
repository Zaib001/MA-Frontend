// components/AppProfile.js
import React, { useState, useEffect } from "react";
import { addProfiledata } from "../api/internal";
import { useSelector } from "react-redux";
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import "sweetalert2/dist/sweetalert2.min.css";

const AppProfile = () => {
  const user = useSelector((state) => state.user._id);
  

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  



  const handleSave = async () => {

    const data = {
      fullname,
      user,
      email,
      birthday,
      address,
      occupation,
      education,
      gender,
      maritalStatus
    };
    

    try {
      // Save profile data
      const response = await addProfiledata(data);
    

      swal({
        title: "Success",
        text:"Profile data saved successfully.",
        icon: "success",
        button: "OK",
      });
    
    } catch (error) {
      console.error("Error saving profile data:", error.message);
   
      swal({
        title: 'Error!',
        text: 'Failed to save profile data. Please try again.!',
        icon: "error",
        button: "OK",
      });
    }
  };
  const resetForm = () => {
    setFullname("");
    setEmail("");
    setBirthday("");
    setAddress("");
    setOccupation("");
    setEducation("");
    setGender("");
    setMaritalStatus("");
};

  const handleDiscard = () => {
    swal({
      title: 'Discard Changes?',
      text:  "Are you sure you want to discard changes?",
      icon: "warning",
      buttons: ["Cancel","Discard"],
      dangerMode: true,
    }).then((willDiscard) => {
      if (willDiscard) {
        navigate('/app');
        resetForm(); 
      }
    });
  };
 

 
  
  

  return (
    <div className="">
     <div className="flex mb-4 justify-center items-center">
     <div className="flex w-1/2 gap-7">
      <div className="w-1/2 mr-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          fullname
        </label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
      <div className="w-1/2 ml-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
    </div>
  </div>
  <div className="flex justify-center items-center">
    <div className="flex w-1/2 gap-7">
      <div className="w-1/2 mr-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          DOB
        </label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
      <div className="w-1/2 ml-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
    </div>
  </div>
  <div className="flex justify-center items-center">
    <div className="flex w-1/2 gap-7">
      <div className="w-1/2 mr-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          Occupation
        </label>
        <input
          type="text"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
      <div className="w-1/2 ml-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          Education
        </label>
        <input
          type="text"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
    </div>
  </div>
  <div className="flex justify-center items-center">
    <div className="flex w-1/2 gap-7">
      <div className="w-1/2 mr-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          Gender
        </label>
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
      <div className="w-1/2 ml-2">
        <label className="text-slate-700 text-xs font-normal font-Lato block mb-2">
          MaritalStatus
        </label>
        <input
          type="text"
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          className="w-full h-10 px-4 border rounded-xl focus:outline-none focus:border-slate-700"
        />
      </div>
    </div>
  </div>
  
      <div className="flex justify-center items-center mt-8 gap-5">
        <button
          onClick={handleSave}
          className={`w-1/4 h-12 bg-slate-700 text-white rounded-lg font-normal font-Lato`}
        >
          Save
        </button>
        <button
          onClick={handleDiscard}
          className={`w-1/4 h-12 bg-slate-700 text-white rounded-lg font-normal font-Lato`}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default AppProfile;
