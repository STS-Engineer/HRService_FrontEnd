import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userFunction, setUserFunction] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [plant_connection, setPlantConnection] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        firstname,
        lastname,
        function: userFunction,
        department,
        email,
        password,
        role,
        plant_connection,
      });
      console.log("Response data:", response.data); // Log response data
      if (response.status === 201) {
        navigate("/login");
      } else {
        console.log("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      console.log("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-500">
      <div className="background-svg">
        <div className="absolute top-0 left-0 m-4">
          <img
            src="/image.png"
            alt="AVOCarbon Group Logo"
            className="w-32 h-auto"
          />
        </div>
      </div>
      <div className="login-container">
        <h2 className="text-center text-2xl font-bold mb-6">Register</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label htmlFor="userFunction" className="sr-only">
                  Function
                </label>
                <input
                  id="userFunction"
                  name="userFunction"
                  type="text"
                  value={userFunction}
                  onChange={(e) => setUserFunction(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Function"
                />
              </div>
              <div>
                <label htmlFor="department" className="sr-only">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Department"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HRMANAGER">HR Manager</option>
                  <option value="PLANT_MANAGER">PLANT Manager</option>
                  <option value="CEO">CEO</option>
                </select>
              </div>
              <div>
                <label htmlFor="plant_connection" className="sr-only">
                  Plant connection
                </label>
                <select
                  id="plant_connection"
                  name="plant_connection"
                  value={plant_connection}
                  onChange={(e) => setPlantConnection(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                >
                  <option value="">Select Plant</option>
                  <option value="AVOCarbon Kunshan">AVOCarbon Kunshan</option>
                  <option value="AVOCarbon Tianjin">AVOCarbon Tianjin</option>
                  <option value="AVOCarbon France ">AVOCarbon France </option>
                  <option value="Cyclam">Cyclam</option>
                  <option value="AVOCarbon Germany">AVOCarbon Germany</option>
                  <option value="AVOCarbon India">AVOCarbon India</option>
                  <option value="AVOCarbon Korea">AVOCarbon Korea</option>
                  <option value="AVOCarbon Tunisia ">AVOCarbon Tunisia </option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              REGISTER
            </button>
          </div>
        </form>

        <div className="mt-8">
          <p className="text-center text-sm font-medium text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 hover:text-orange-700">
              Sign In here
            </a>
          </p>
        </div>
      </div>

      {/* Absolute positioned logo */}
      <div
        style={{
          position: "absolute",
          right: "16%",
          padding: "1rem",
          backgroundColor: "#f6f5fb",
          borderRadius: "100%",
        }}
      >
        <img
          src="/1267633.png"
          alt="Logo"
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>
  );
};

export default Register;
