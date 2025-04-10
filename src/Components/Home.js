import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { useTranslation } from "react-i18next";
import { HomeIcon } from "@heroicons/react/24/outline";
import DynamicHeader from "./DynamicHeader"; // Import the DynamicHeader

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLeaveRequestClick = () => {
    navigate("/leave-request");
  };
  // Function to handle card click and navigate to MissionRequest page
  const handleMissionRequestClick = () => {
    navigate("/mission-request");
  };
  // Function to handle card click and navigate to AuthorizationRequest page
  const handleAuthoRequestClick = () => {
    navigate("/auth-request");
  };
  // Function to handle card click and navigate to Document page
  const handleDocumentRequestClick = () => {
    navigate("/document-request");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <DynamicHeader currentPath={location.pathname} />
        {/* HEADER SECTION */}
        {/* <div className="bg-white p-4 shadow-sm border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Default Dashboard</span>
          </div>
        </div> */}

        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleLeaveRequestClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="lee.png"
                  alt={t("leave_request")}
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">{t("Leave Request")}</h3>
                <p className="text-gray-600">{t("click_to_request_leave")}</p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleMissionRequestClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="mission.png"
                  alt="Card 2"
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">{t("mission_request")}</h3>
                <p className="text-gray-600">{t("click_to_request_mission")}</p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleAuthoRequestClick}
            >
              <div className="flex justify-center items-center">
                <img src="author.png" alt="Card 3" className="w-48 h-48 " />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">
                  {t("authorization_request")}
                </h3>
                <p className="text-gray-600">
                  {t("click_to_request_authorization")}
                </p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleDocumentRequestClick}
            >
              <div className="flex justify-center items-center">
                <img src="bookmark.png" alt="Card 4" className="w-48 h-48 " />
              </div>

              <div className="p-4">
                <h3 className="text-md font-bold">
                  {t("work_documents_request")}
                </h3>
                <p className="text-gray-600">
                  {t("click_to_request_documents")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
