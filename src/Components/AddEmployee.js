// AddEmployeeForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    department: "",
    email: "",
    password: "",
    role: "Employee",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/register", formData);
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleBackClick = () => {
    window.history.back(); // Navigate to the previous page
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handleBackClick}
        className="mb-4 text-gray-500 hover:text-gray-700"
        aria-label="Back"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-bold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
