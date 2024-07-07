import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    employeeId: "",
    hoursWorked: "",
    rate: "",
  });
  const [estimate, setEstimate] = useState({
    companyInfo: {
      name: "",
      website: "",
      logo: "",
    },
    invoices: [],
  });
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    website: "",
    logo: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    fetch("https://ma-ney3.onrender.com/api/invoices")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched invoices:", data);
        setInvoices(data);
      })
      .catch((error) => console.error("Error fetching invoices:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prevCompanyInfo) => ({
      ...prevCompanyInfo,
      [name]: value,
    }));
  };

  const handleAddInvoice = () => {
    fetch("https://ma-ney3.onrender.com/api/invoices/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvoice),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire(
          "Invoice Added!",
          "The invoice has been successfully added.",
          "success"
        );
        setInvoices((prevInvoices) => [...prevInvoices, data]);
        setNewInvoice({ employeeId: "", hoursWorked: "", rate: "" });
      })
      .catch((error) => {
        console.error("Error adding invoice:", error);
        Swal.fire(
          "Error!",
          "An error occurred while adding the invoice.",
          "error"
        );
      });
  };

  const handleCreateEstimate = () => {
    const estimateData = {
      companyInfo,
      invoices: invoices.map((invoice) => invoice._id),
    };

    fetch("https://ma-ney3.onrender.com/api/estimates/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estimateData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        Swal.fire(
          "Estimate Created!",
          `The estimate has been successfully created. View it <a href="${data.estimateUrl}" target="_blank">here</a>.`,
          "success"
        );
      })
      .catch((error) => {
        console.error("Error creating estimate:", error);
        Swal.fire(
          "Error!",
          "An error occurred while creating the estimate.",
          "error"
        );
      });
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Invoice Management</h3>
      <div className="flex mb-4">
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="employeeId"
          value={newInvoice.employeeId}
          onChange={handleInputChange}
          placeholder="Employee ID"
        />
        <input
          type="number"
          className="border rounded-md p-2 mr-2"
          name="hoursWorked"
          value={newInvoice.hoursWorked}
          onChange={handleInputChange}
          placeholder="Hours Worked"
        />
        <input
          type="number"
          className="border rounded-md p-2 mr-2"
          name="rate"
          value={newInvoice.rate}
          onChange={handleInputChange}
          placeholder="Rate"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleAddInvoice}
        >
          Add Invoice
        </button>
      </div>
      <h4 className="text-lg font-bold mb-2">Invoices</h4>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Employee name</th>
            <th className="px-4 py-2">Hours Worked</th>
            <th className="px-4 py-2">Rate</th>
            <th className="px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td className="border px-4 py-2">{invoice.employeeId ? invoice.employeeId.name : 'N/A'}</td>
              <td className="border px-4 py-2">{invoice.hoursWorked}</td>
              <td className="border px-4 py-2">{invoice.rate}</td>
              <td className="border px-4 py-2">
                {invoice.hoursWorked * invoice.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-bold mt-4 mb-4">Company Information</h3>
      <div className="flex mb-4">
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="name"
          value={companyInfo.name}
          onChange={handleCompanyInfoChange}
          placeholder="Company Name"
        />
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="website"
          value={companyInfo.website}
          onChange={handleCompanyInfoChange}
          placeholder="Website"
        />
        <input
          type="text"
          className="border rounded-md p-2 mr-2"
          name="logo"
          value={companyInfo.logo}  
          onChange={handleCompanyInfoChange}
          placeholder="Logo URL"
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md"
        onClick={handleCreateEstimate}
      >
        Create Estimate
      </button>
    </div>
  );
};

export default InvoiceManagement;
