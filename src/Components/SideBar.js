import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BsHouseDoorFill,
  BsCalendarCheckFill,
  BsBriefcaseFill,
  BsShieldLockFill,
  BsFileEarmarkFill,
  BsBarChartFill,
} from "react-icons/bs";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Default closed for mobile

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
        className={`fixed inset-y-0 left-0 w-64 bg-white text-black shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-30`} // Increased z-index for sidebar
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
        <div className="p-4 flex items-center justify-center md:justify-start lg:justify-center mt-10">
          <img
            src="image.png"
            alt="Logo"
            className="h-20 mb-5 mx-auto md:mx-0"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <ul>
            <li className="my-2">
              <Link
                to="/home"
                className="flex items-center p-3 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
              >
                <BsHouseDoorFill className="mr-3 text-lg" /> Home
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/my-leave"
                className="flex items-center p-3 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
              >
                <BsCalendarCheckFill className="mr-3 text-lg" /> My Leave
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/my-mission"
                className="flex items-center p-3 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
              >
                <BsBriefcaseFill className="mr-3 text-lg" /> My Mission
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/my-auth"
                className="flex items-center p-3 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
              >
                <BsShieldLockFill className="mr-3 text-lg" /> My Authorization
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/my-docs"
                className="flex items-center p-3 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
              >
                <BsFileEarmarkFill className="mr-3 text-lg" /> My Documents
              </Link>
            </li>
            {/* <li className="my-2">
              <Link
                to="/dashboard"
                className="flex items-center p-3 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
              >
                <BsBarChartFill className="mr-3 text-lg" /> Dashboard
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* Overlay for Mobile */}
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

export default Sidebar;
