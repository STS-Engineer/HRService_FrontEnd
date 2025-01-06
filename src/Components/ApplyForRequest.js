import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBarAdmin from "./SideBarAdmin";
import TopBar from "./TopBar";
import { useTranslation } from "react-i18next";

const Requets = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLeaveRequestClick = () => {
    navigate("/leave-request-admin");
  };
  // Function to handle card click and navigate to MissionRequest page
  const handleMissionRequestClick = () => {
    navigate("/mission-request-admin");
  };
  // Function to handle card click and navigate to AuthorizationRequest page
  const handleAuthoRequestClick = () => {
    navigate("/auth-request-admin");
  };
  // Function to handle card click and navigate to Document page
  const handleDocumentRequestClick = () => {
    navigate("/document-request-admin");
  };
  return (
    <div className="flex h-screen">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />
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
                  {" "}
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
export default Requets;
