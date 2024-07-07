import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchEmployees } from '../store/eSlice'; // Adjust the path as needed
import { clockIn, clockOut, fetchClockInStatus } from '../store/clockSlice'; // Adjust the path as needed
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employees);
  const employeeStatus = useSelector((state) => state.employees.status);
  const employeeError = useSelector((state) => state.employees.error);
  const clockInStatus = useSelector((state) => state.clock.clockInStatus);
  const [employeeNames, setEmployeeNames] = useState({});
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    picture: '',
    phone: '',
    email: '',
    location: '',
    role: '',
    pay: '',
  });

  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBbg-OAnHA3rxOsYiwImrTtICoiu7PvMYk',
    libraries,
  });

  useEffect(() => {
    if (employeeStatus === 'idle') {
      dispatch(fetchEmployees());
    }
    fetchJobs();
    dispatch(fetchClockInStatus());
  }, [employeeStatus, dispatch]);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const names = {};
      for (const employee of employees) {
        names[employee._id] = employee.name;
      }
      setEmployeeNames(names);
      if (isLoaded) {
        displayEmployeeLocationsOnMap();
      }
    };

    fetchEmployeeNames();
  }, [employees, isLoaded]);

  const fetchJobs = () => {
    fetch('https://ma-ney3.onrender.com/api/jobs')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      picture: file,
    }));
  };

  const handleAddEmployee = () => {
    const formData = new FormData();
    for (const key in newEmployee) {
      formData.append(key, newEmployee[key]);
    }

    const addButton = document.querySelector('#addEmployeeButton');
    addButton.disabled = true;

    fetch('https://ma-ney3.onrender.com/api/employees/create', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire('Employee Added!', 'The employee has been successfully added.', 'success');
        addButton.disabled = false;
        dispatch(fetchEmployees());
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
        Swal.fire('Error!', 'An error occurred while adding the employee.', 'error');
        addButton.disabled = false;
      });
  };

  const handleAssignJob = (employeeId) => {
    if (!selectedJobId) {
      Swal.fire('Select Job', 'Please select a job to assign.', 'warning');
      return;
    }

    fetch('https://ma-ney3.onrender.com/api/assign-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId: selectedJobId, employeeId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to assign job');
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire('Job Assigned!', 'The job has been successfully assigned.', 'success');
        fetchJobs();
        dispatch(fetchEmployees());
      })
      .catch((error) => {
        console.error('Error assigning job:', error);
        Swal.fire('Error!', 'An error occurred while assigning the job.', 'error');
      });
  };

  const displayEmployeeLocationsOnMap = useCallback(() => {
    const google = window.google;
    if (!google || !isLoaded) return;

    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 4,
    };

    const mapInstance = new google.maps.Map(document.getElementById('map'), mapOptions);
    setMap(mapInstance);

    const newMarkers = employees.map((employee) => {
      const marker = new google.maps.Marker({
        position: {
          lat: employee.location.coordinates[0],
          lng: employee.location.coordinates[1],
        },
        map: mapInstance,
        title: employee.name,
      });
      return marker;
    });

    setMarkers(newMarkers);
  }, [employees, isLoaded]);

  const handleClockIn = (employeeId) => {
    fetch('https://ma-ney3.onrender.com/api/clock/clock-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to clock in');
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire('Clocked In!', 'The employee has been successfully clocked in.', 'success');
        dispatch(fetchEmployees());
      })
      .catch((error) => {
        console.error('Error clocking in:', error);
        Swal.fire('Error!', 'An error occurred while clocking in.', 'error');
      });
  };

  const handleClockOut = (employeeId) => {
    fetch('https://ma-ney3.onrender.com/api/clock/clock-out', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to clock out');
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire('Clocked Out!', 'The employee has been successfully clocked out.', 'success');
        dispatch(fetchEmployees());
      })
      .catch((error) => {
        console.error('Error clocking out:', error);
        Swal.fire('Error!', 'An error occurred while clocking out.', 'error');
      });
  };

  if (employeeStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (employeeStatus === 'failed') {
    return <div>{employeeError}</div>;
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div>
      <h1>Employee Management</h1>
      <div>
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="name"
          value={newEmployee.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="phone"
          value={newEmployee.phone}
          onChange={handleInputChange}
          placeholder="Phone"
        />
        <input
          type="email"
          className="border rounded-md p-2 mr-2"
          name="email"
          value={newEmployee.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="location"
          value={newEmployee.location}
          onChange={handleInputChange}
          placeholder="Location"
        />
        <select
          name="role"
          value={newEmployee.role}
          onChange={handleInputChange}
          className="border rounded-md p-2 mr-2"
        >
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="number"
          className="border rounded-md p-2 mr-2"
          name="pay"
          value={newEmployee.pay}
          onChange={handleInputChange}
          placeholder="Pay"
        />
        <input
          type="file"
          className="border rounded-md p-2 mr-2"
          name="picture"
          onChange={handleFileChange}
        />
        <button
          id="addEmployeeButton"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleAddEmployee}
        >
          Add Employee
        </button>
      </div>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Picture</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Pay</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td className="border px-4 py-2">{employee.name}</td>
              <td className="border px-4 py-2">
                {employee.picture && (
                  <img
                    src={`http://localhost:4242/api/employees/uploads/${employee.picture}`}
                    alt={employee.name}
                    className="w-16 h-16 object-cover"
                  />
                )}
              </td>
              <td className="border px-4 py-2">{employee.phone}</td>
              <td className="border px-4 py-2">{employee.email}</td>
              <td className="border px-4 py-2">{employee.location.coordinates.join(', ')}</td>
              <td className="border px-4 py-2">{employee.role}</td>
              <td className="border px-4 py-2">{employee.pay}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => handleClockIn(employee._id)}
                >
                  Clock In
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => handleClockOut(employee._id)}
                >
                  Clock Out
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                  onClick={() => handleAssignJob(employee._id)}
                >
                  Assign Job
                </button>
                <select
                  name="job"
                  className="border rounded-md p-2 mt-2"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  <option value="">Select Job</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
    </div>
  );
};

export default EmployeeManagement;
