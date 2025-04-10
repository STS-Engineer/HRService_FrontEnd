import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BsHouseDoorFill,
  BsClipboardCheck,
  BsChatLeftTextFill,
  BsBarChartFill,
  BsClockFill,
} from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { FaFileAlt } from "react-icons/fa";

const SideBarAdmin = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

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
        className={`fixed inset-y-0 left-0 w-64 bg-white text-gray-700 shadow-2xl rounded-r-xl transform ${
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
        <nav className="flex-1 px-4">
          <ul className="space-y-6">
            <li className="my-2">
              <Link
                to="/home-admin"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsHouseDoorFill className="mr-2" /> {t("sidebar.home")}
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/requests"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsClipboardCheck className="mr-2" /> {t("sidebar.requests")}
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/demands"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsChatLeftTextFill className="mr-2" /> {t("sidebar.demands")}
              </Link>
            </li>
            <li className="my-2">
              {/* <Link
                to="/pointing-management"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsClockFill className="mr-2" />{" "}
                {t("sidebar.PointingManagement")}
              </Link> */}
              <li className="my-2">
                <div>
                  <button
                    className="flex items-center justify-between p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200 w-full"
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                  >
                    <div className="flex items-center">
                      <BsClockFill className="mr-2" />
                      {t("sidebar.PointingManagement")}
                    </div>
                    <span>{isSubmenuOpen ? "▲" : "▼"}</span>
                  </button>

                  {/* Scrollable Submenu */}
                  {isSubmenuOpen && (
                    <ul
                      className="mt-2 ml-6 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                      style={{
                        background: "#f9f9f9",
                        borderRadius: "8px",
                      }}
                    >
                      <li className="mb-2">
                        <Link
                          to="/pointing-management"
                          className="flex items-center p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition duration-200"
                        >
                          {t("sidebar.Daily Pointing")}
                        </Link>
                      </li>
                      <li className="mb-2">
                        <Link
                          to="/my-pointing-Report"
                          className="flex items-center p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition duration-200"
                        >
                          {t("sidebar.Daily Pointing Reports")}
                        </Link>
                      </li>
                      {/* <li className="mb-2">
                        <Link
                          to="/pointing-hours-perweek"
                          className="flex items-center p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition duration-200"
                        >
                          {t("sidebar.Working Hours")}
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          to="/pointing-hours-perweek"
                          className="flex items-center p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition duration-200"
                        >
                          {t("sidebar.Pointing Reports")}
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            </li>
            <li className="my-2">
              <Link
                to="/Dispatch-SalaryCertificate-Manager"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <FaFileAlt className="mr-3 text-lg" />{" "}
                {t("sidebar.salaryCertificate")}
              </Link>
            </li>
            <li className="my-2">
              <Link
                to="/my-pointing-Manager"
                className="flex items-center p-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md transition duration-200"
              >
                <BsClockFill className="mr-3 text-xl" />{" "}
                {t("sidebar.myPointing")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default SideBarAdmin;
