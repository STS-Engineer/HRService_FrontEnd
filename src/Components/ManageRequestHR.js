import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarHR from "./SideBarHR";
import TopBar from "./TopBar";

const ManageRequestHR = () => {
  const navigate = useNavigate();

  const handleLeaveManagementClick = () => {
    navigate("/admin-dashboard");
  };

  const handleMissionManagementClick = () => {
    navigate("/mission-management");
  };

  const handleDocumentManagementClick = () => {
    navigate("/document-management");
  };

  const handleAuthoRequestClick = () => {
    navigate("/auth-management");
  };

  return (
    <div className="flex h-screen">
      <SidebarHR />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleLeaveManagementClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="software_engineer_re_tnjc.png"
                  alt="Manage Leave Requests"
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">Manage Leave Requests</h3>
                <p className="text-gray-600">Click to manage leave requests</p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleMissionManagementClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="product_iteration_kjok.png"
                  alt="Manage Mission Requests"
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">Manage Mission Requests</h3>
                <p className="text-gray-600">
                  Click to manage mission requests
                </p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleAuthoRequestClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="undraw_Speed_test_re_pe1f.png"
                  alt="Manage auth Requests"
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">
                  Manage Authorization Requests
                </h3>
                <p className="text-gray-600">
                  Click to manage authorization requests
                </p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleDocumentManagementClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="add_files_re_v09g.png"
                  alt="Manage Document Requests"
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">Manage Documents</h3>
                <p className="text-gray-600">Click to manage documents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequestHR;
