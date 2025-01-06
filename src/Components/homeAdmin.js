import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "./SideBarAdmin";
import TopBar from "./TopBar";
import { useTranslation } from "react-i18next";

const HomeAdmin = () => {
  const { t } = useTranslation();
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
      <SidebarAdmin />
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
                  alt={t("homeAdmin.manageLeave.title")}
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">
                  {t("homeAdmin.manageLeave.title")}
                </h3>
                <p className="text-gray-600">
                  {t("homeAdmin.manageLeave.description")}
                </p>
              </div>
            </div>
            <div
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleMissionManagementClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src="product_iteration_kjok.png"
                  alt={t("homeAdmin.manageMission.title")}
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">
                  {t("homeAdmin.manageMission.title")}
                </h3>
                <p className="text-gray-600">
                  {t("homeAdmin.manageMission.description")}
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
                  alt={t("homeAdmin.manageAuth.title")}
                  className="w-48 h-48 center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-bold">
                  {t("homeAdmin.manageAuth.title")}
                </h3>
                <p className="text-gray-600">
                  {t("homeAdmin.manageAuth.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
