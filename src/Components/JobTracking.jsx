import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const statusOptions = [
  "Needs Estimate Sent",
  "Estimate Sent Needs Approval",
  "Approved Estimate",
  "Schedule Job",
  "Job Scheduled",
  "Job Completed Need Invoiced",
  "Invoiced Needs Paid",
  "Paid",
];

const workStatusOptions = [
  "Not Started",
  "In Progress",
  "Material Delay",
  "Waiting on Customer",
  "Completed",
  "Need Review",
];

const JobTracking = () => {
  const user = useSelector((state) => state.user._id);
  const employees = useSelector((state) => state.employees.employees);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newDocumentFile, setNewDocumentFile] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null); // State for image uploads
  const [documents, setDocuments] = useState([]);
  const [activeSection, setActiveSection] = useState("office");
  const [workNotes, setWorkNotes] = useState("");
  const [jobDates, setJobDates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    axios.get("https://ma-ney3.onrender.com/api/jobs")
      .then((response) => setJobs(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedJob) {
      axios.get(`https://ma-ney3.onrender.com/api/jobs/${selectedJob._id}/workNotes`)
        .then((response) => setWorkNotes(response.data.notes || ""))
        .catch((error) => console.error(error));

      axios.get(`https://ma-ney3.onrender.com/api/jobs/${selectedJob._id}/dates`)
        .then((response) => setJobDates(response.data.dates || []))
        .catch((error) => console.error(error));
    }
  }, [selectedJob]);


  const handleSelectJob = (job) => {
    setSelectedJob(job);
    axios.get(`https://ma-ney3.onrender.com/api/jobs/${job._id}/folders`)
      .then((response) => {
        setFolders(response.data);
        setSelectedFolder(null);
      })
      .catch((error) => console.error(error));
  };

  const handleSelectFolder = (folder) => {
    setSelectedFolder(folder);
    axios.get(`https://ma-ney3.onrender.com/api/folders/${folder._id}/documents`)
      .then((response) => setDocuments(response.data))
      .catch((error) => console.error(error));
  };

  const createFolder = () => {
    axios.post(`https://ma-ney3.onrender.com/api/jobs/${selectedJob._id}/folders`, { name: newFolderName })
      .then((response) => {
        setFolders([...folders, response.data]);
        setNewFolderName("");
      })
      .catch((error) => console.error(error));
  };

  const uploadDocument = () => {
    if (!newDocumentFile) return;
    const formData = new FormData();
    formData.append("document", newDocumentFile);

    axios.post(`https://ma-ney3.onrender.com/api/folders/${selectedFolder._id}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        setDocuments([...documents, response.data]);
        setNewDocumentFile(null);
      })
      .catch((error) => console.error(error));
  };

  const uploadImage = () => {
    if (!newImageFile) return;
    const formData = new FormData();
    formData.append("image", newImageFile);

    axios.post(`https://ma-ney3.onrender.com/api/jobs/${selectedJob._id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // Assuming the response returns the updated job with images
        setSelectedJob(response.data);
        setNewImageFile(null);
      })
      .catch((error) => console.error(error));
  };

  const calculateProgress = (status, type = "office") => {
    const options = type === "office" ? statusOptions : workStatusOptions;
    const statusIndex = options.indexOf(status);
    return ((statusIndex + 1) / options.length) * 100;
  };

  const updateJobStatus = (newStatus, section) => {
    const requestData = { status: newStatus, userId: user };
    const endpoint = section === 'office' ? 'status' : 'workStatus';

    axios.put(`https://ma-ney3.onrender.com/api/jobs/${selectedJob._id}/${endpoint}`, requestData)
      .then((response) => {
        const updatedJob = response.data;
        setSelectedJob(updatedJob);
        setJobs(jobs.map(job => (job._id === selectedJob._id ? updatedJob : job)));
      })
      .catch((error) => {
        console.error("Error updating job status:", error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Failed to update job status. Please try again.");
        }
      });
  };
  const handleSendMessage = async () => {
    console.log(employees)
    if (selectedJob && newMessage) {
      try {
        const response = await axios.post('https://ma-ney3.onrender.com/api/messages/send', {
          jobId: selectedJob._id,
          senderId: user,
          text: newMessage,
        });
  
        // Assuming the server returns the new message data on success
        setMessages([...messages, response.data]);
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
  
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
  
          if (error.response.status === 400) {
            alert(`Bad Request: ${error.response.data.message}`);
          } else {
            alert(`Error: ${error.response.status} - ${error.response.data.message}`);
          }
        } else if (error.request) {
          // Request was made but no response was received
          console.error("Request data:", error.request);
          alert("No response received from the server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          alert("Error in sending request.");
        }
      }
    }
  };
  

  const saveWorkNotes = () => {
    axios.put(`https://ma-ney3.onrender.com/api/jobs/${selectedJob._id}/workNotes`, {
      notes: workNotes,
      userId: user,
    })
    .then((response) => {
      console.log("Work notes saved successfully");
    })
    .catch((error) => {
      console.error("Error saving work notes:", error);
    });
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && jobDates.some(jobDate => new Date(jobDate).toDateString() === date.toDateString())) {
      return 'highlight';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Job Tracking</h2>
      <div>
        <button onClick={() => setActiveSection("office")} className={`mr-4 px-4 py-2 rounded-md ${activeSection === 'office' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Office</button>
        <button onClick={() => setActiveSection("work")} className={`px-4 py-2 rounded-md ${activeSection === 'work' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Work</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(jobs) &&
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSelectJob(job)}
            >
              <h3 className="text-xl font-semibold mb-2">{`Job ${job.title}`}</h3>
              <p>
                <strong>Status:</strong> {job.status}
              </p>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="rounded-full h-2"
                    style={{
                      width: `${calculateProgress(job.status)}%`,
                      backgroundColor: "green",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {selectedJob && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold mb-4">Job Details</h3>
          <p><strong>Title:</strong> {selectedJob.title}</p>
          <p><strong>Notes:</strong> {selectedJob.notes}</p>
          <p><strong>Assigned Worker:</strong> {selectedJob.assignedWorker}</p>
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
  <h3 className="text-xl font-semibold mb-4">Messages</h3>
  <ul className="space-y-2">
    {messages.map((message) => (
      <li key={message._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
        {message.text}
      </li>
    ))}
  </ul>
  <div className="mt-4 flex items-center">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      className="border border-gray-300 p-2 rounded-lg flex-grow mr-2"
      placeholder="Type your message here..."
    />
    <button
      onClick={handleSendMessage}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Send Message
    </button>
  </div>
</div>


          {activeSection === "office" ? (
            <>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="rounded-full h-2"
                    style={{
                      width: `${calculateProgress(selectedJob.status)}%`,
                      backgroundColor: "green",
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2">Folders:</h4>
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    className="bg-gray-100 p-4 rounded-lg mb-2 cursor-pointer"
                    onClick={() => handleSelectFolder(folder)}
                  >
                    {folder.name}
                  </div>
                ))}
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg mr-2"
                  placeholder="New folder name"
                />
                <button
                  onClick={createFolder}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Create Folder
                </button>
              </div>

              {selectedFolder && (
                <div className="mt-4">
                  <h4 className="text-xl font-semibold mb-2">Documents in {selectedFolder.name}:</h4>
                  {documents.map((document) => (
                    <div key={document._id} className="bg-gray-100 p-4 rounded-lg mb-2">
                      <a href={`https://ma-ney3.onrender.com/${document.url}`} target="_blank" rel="noopener noreferrer">
                        {document.name}
                      </a>
                    </div>
                  ))}
                  <div className="mt-2 flex">
                    <input
                      type="file"
                      onChange={(e) => setNewDocumentFile(e.target.files[0])}
                      className="border border-gray-300 p-2 mr-2 rounded-lg"
                    />
                    <button
                      onClick={uploadDocument}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2">Job Dates:</h4>
                <Calendar
                  tileClassName={tileClassName}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="rounded-full h-2"
                    style={{
                      width: `${calculateProgress(selectedJob.workStatus, "work")}%`,
                      backgroundColor: "green",
                    }}
                  ></div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2">Work Notes:</h4>
                <textarea
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full h-32"
                />
                <button
                  onClick={saveWorkNotes}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Save Notes
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2">Upload Images:</h4>
                <input
                  type="file"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                  className="border border-gray-300 p-2 mr-2 rounded-lg"
                />
                <button
                  onClick={uploadImage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Upload Image
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2">Job Dates:</h4>
                <Calendar
                  tileClassName={tileClassName}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobTracking;
