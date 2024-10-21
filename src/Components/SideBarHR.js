import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BsHouseDoorFill,
  BsPeopleFill,
  // BsClipboardCheck,
  // BsChatLeftTextFill,
  BsBarChartFill,
} from "react-icons/bs";

import { FaFileAlt } from "react-icons/fa";

const SidebarHR = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-gray-600 hover:text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Navigation Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white text-gray-700 shadow-2xl rounded-r-2xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-30`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label="Close Navigation Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Logo or Branding */}
        <div className="p-4 flex items-center justify-center mt-10">
          <img
            src="image.png"
            alt="Logo"
            className="h-20 mb-5  border-2 border-gray-300 shadow-lg"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-6">
            <li className="my-2">
              <Link
                to="/home-rh"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsHouseDoorFill className="mr-3 text-lg" /> Home
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/employee-management"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsPeopleFill className="mr-3 text-lg" /> Employee Management
              </Link>
            </li>

            <li className="my-2">
              <Link
                to="/RH-dashboard"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsBarChartFill className="mr-3 text-lg" /> Dashboard
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/Dispatch-SalaryCertificate"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <FaFileAlt className="mr-3 text-lg" /> Salary Certificate
              </Link>
            </li>
            {/* <li className="my-2">
              <Link
                to="/requests-RH"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsClipboardCheck className="mr-2" /> Apply for Requests
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/demands-RH"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsChatLeftTextFill className="mr-2" /> Consult Demands
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20" // Covers entire screen with opacity
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default SidebarHR;
