import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Footer from "./Components/Footer";
import LeaveRequest from "./Components/LeaveRequest";
import MissionRequest from "./Components/MissionRequest";
import Login from "./Components/Login";
import AdminDashboard from "./Components/AdminDashboard";
import SideBarAdmin from "./Components/SideBarAdmin";
import Sidebar from "./Components/SideBar";
import TopBar from "./Components/TopBar";
import Home from "./Components/Home";
import MyLeave from "./Components/Myleave";
import MyMission from "./Components/Mymission";
import HomeAdmin from "./Components/homeAdmin";
import MissionAdmin from "./Components/MissionAdmin";
import AuthAdmin from "./Components/AuthAdmin";
import Register from "./Components/Register";
import AuthRequest from "./Components/AuthRequest";
import MyAuth from "./Components/Myauth";
import HomeHR from "./Components/HomeHR";
import DocumentRequest from "./Components/DocumentRequest";
import MyDoc from "./Components/Mydoc";
import DocumentAdmin from "./Components/DocAdmin";
import Profile from "./Components/profile";
import ChangePassword from "./Components/ChangePassword";
import Requets from "./Components/ApplyForRequest";
import DemandsPage from "./Components/Mydemands";
import SidebarHR from "./Components/SideBarHR";
import EmployeeManagement from "./Components/EmployeeManagement";
import AddEmployee from "./Components/AddEmployee";
import Dashboard from "./Components/Dashboard";
import SalaryCertificateUpload from "./Components/SalaryCertificateUpload";
import Chatbot from "./Components/Chatbot";
import ManageRequestHR from "./Components/ManageRequestHR";
import PointingManagement from "./Components/PointingManagement";
import EmployeePointing from "./Components/MyPointing";
import PointingManagementRH from "./Components/Pointing_RH";

const App = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [missionRequests, setMissionRequests] = useState([]);
  const [authorizationRequests, setAuthRequests] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);

  const handleLeaveRequest = (newLeaveRequest) => {
    setLeaveRequests([...leaveRequests, newLeaveRequest]);
  };

  const handleMissionRequest = (newMissionRequest) => {
    setMissionRequests([...missionRequests, newMissionRequest]);
  };

  const handleAuthRequest = (newAuthRequest) => {
    setAuthRequests([...authorizationRequests, newAuthRequest]);
  };
  const handleDocumentRequest = (newDocumentRequest) => {
    setDocumentRequests([...documentRequests, newDocumentRequest]);
  };

  const handleStatusChange = (id, status, type) => {
    if (type === "leave") {
      const updatedRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: status } : request
      );
      setLeaveRequests(updatedRequests);
    } else if (type === "mission") {
      const updatedRequests = missionRequests.map((request) =>
        request.id === id ? { ...request, status: status } : request
      );
      setMissionRequests(updatedRequests);
    } else if (type === "auth") {
      const updatedRequests = authorizationRequests.map((request) =>
        request.id === id ? { ...request, status: status } : request
      );
      setAuthRequests(updatedRequests);
    } else if (type === "document") {
      const updatedRequests = documentRequests.map((request) =>
        request.id === id ? { ...request, status: status } : request
      );
      setDocumentRequests(updatedRequests);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin-dashboard"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <AdminDashboard
                      leaveRequests={leaveRequests}
                      handleStatusChange={handleStatusChange}
                    />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/mission-management"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <MissionAdmin
                      missionRequests={missionRequests}
                      handleStatusChange={handleStatusChange}
                    />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/auth-management"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <AuthAdmin
                      authorizationRequests={authorizationRequests}
                      handleStatusChange={handleStatusChange}
                    />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route path="/home-rh" element={<HomeHR />} />
          <Route
            path="/document-management"
            element={
              <div className="flex h-screen">
                <SidebarHR />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <DocumentAdmin
                      documentRequests={documentRequests}
                      handleStatusChange={handleStatusChange}
                    />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/document-request-admin"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <DocumentRequest onSubmit={handleDocumentRequest} />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/document-request"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <DocumentRequest onSubmit={handleDocumentRequest} />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/my-docs"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <MyDoc employeeId="" />{" "}
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/leave-request-admin"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <LeaveRequest onSubmit={handleLeaveRequest} />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/leave-request"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <LeaveRequest onSubmit={handleLeaveRequest} />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/mission-request-admin"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <MissionRequest onSubmit={handleMissionRequest} />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/mission-request"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <MissionRequest onSubmit={handleMissionRequest} />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/auth-request-admin"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <AuthRequest onSubmit={handleAuthRequest} />{" "}
                    {/* Corrected component */}
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/demands"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <DemandsPage />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/auth-request"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <AuthRequest onSubmit={handleAuthRequest} />{" "}
                    {/* Corrected component */}
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/requests" element={<Requets />} />
          <Route path="/home-admin" element={<HomeAdmin />} />
          <Route path="/home-admin-HR" element={<ManageRequestHR />} />
          <Route
            path="/my-leave"
            element={<MyLeave leaveRequests={leaveRequests} />}
          />
          <Route
            path="/my-mission"
            element={<MyMission missionRequests={missionRequests} />}
          />
          <Route
            path="/my-auth"
            element={<MyAuth authorizationRequests={authorizationRequests} />}
          />
          <Route
            path="/profile"
            element={
              <div className="flex h-screen">
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <Profile />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/change-password"
            element={
              <div className="flex h-screen">
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <ChangePassword />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/employee-management"
            element={
              <div className="flex h-screen">
                <SidebarHR />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <EmployeeManagement />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/add-employee"
            element={
              <div className="flex h-screen">
                <SidebarHR />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <AddEmployee />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/RH-dashboard"
            element={
              <div className="flex h-screen">
                <SidebarHR />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <Dashboard />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/Dispatch-SalaryCertificate"
            element={
              <div className="flex h-screen">
                <SidebarHR />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <SalaryCertificateUpload />
                  </div>

                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/pointing-management-RH"
            element={
              <div className="flex h-screen">
                <SidebarHR />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <PointingManagementRH />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/pointing-management"
            element={
              <div className="flex h-screen">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <PointingManagement />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route
            path="/my-pointing"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <EmployeePointing />
                  </div>
                  <Footer />
                </div>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
