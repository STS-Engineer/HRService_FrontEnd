import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Table, Button, Select, DatePicker, Pagination, Card, Tag } from "antd";
import TopBar from "./TopBar";
import SidebarHR from "./SideBarHR";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const { Option } = Select;
const getLeaveTypeTagColor = (leaveType) => {
  switch (leaveType) {
    case "half_day":
      return "blue";
    case "Wedding":
      return "purple";
    case "Business":
      return "green";
    case "Injury":
      return "red";
    case "Sick":
      return "orange";
    case "Maternity":
      return "pink";
    case "Funeral":
      return "gray";
    case "Annual Leave":
      return "cyan";
    case "Compensatory":
      return "yellow";
    case "Without Pay":
      return "black";
    case "Seniority":
      return "lime";
    case "Other":
      return "teal";
    default:
      return "default";
  }
};
const getTypeTagColor = (type) => {
  switch (type) {
    case "Leave":
      return "blue";
    case "Mission":
      return "green";
    case "Authorization":
      return "orange";
    default:
      return "gray";
  }
};
const HomeHR = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [filter, setFilter] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      try {
        const leaveRequestsResponse = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/leave-requests/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const missionRequestsResponse = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/mission-requests/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const authorizationRequestsResponse = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/authorization-requests/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const leaveRequests = leaveRequestsResponse.data.map((req) => ({
          id: req.requestid,
          employeeId: req.employeeid,
          type: "Leave",
          leaveType: req.leavetype || "-",
          startDate: req.startdate,
          endDate: req.enddate,
          status: req.status,
          firstName: req.firstname,
          lastName: req.lastname,
          function: req.function || "-",
          department: req.department || "-",
        }));

        const missionRequests = missionRequestsResponse.data.map((req) => ({
          id: req.requestid,
          employeeId: req.employeeid,
          type: "Mission",
          leaveType: "_",
          startDate: req.startdate,
          endDate: req.enddate,
          status: req.status,
          firstName: req.firstname,
          lastName: req.lastname,
          function: req.function || "-",
          department: req.department || "-",
        }));

        const authorizationRequests = authorizationRequestsResponse.data.map(
          (req) => ({
            id: req.requestid,
            employeeId: req.employeeid,
            type: "Authorization",
            leaveType: "_",
            startDate: req.authorizationdate,
            endDate: req.authorizationdate,
            status: req.status,
            firstName: req.firstname,
            lastName: req.lastname,
            function: req.function || "-",
            department: req.department || "-",
            departureTime: req.departure_time || "-", // Add departure_time
            returnTime: req.return_time || "-", // Add return_time
          })
        );

        const combinedRequests = [
          ...leaveRequests,
          ...missionRequests,
          ...authorizationRequests,
        ];

        setRequests(combinedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch requests.",
        });
      }
    };

    fetchRequests();
  }, []);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0; // Handle undefined dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // Return 0 if dates are invalid
  };

  const filteredRequests = requests.filter((req) => {
    if (req.status !== "Approved") return false;
    if (filter !== "All" && req.type !== filter) return false;
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      const startDateObj = new Date(req.startDate);
      const endDateObj = new Date(req.endDate);
      if (filterDateObj < startDateObj || filterDateObj > endDateObj)
        return false;
    }
    return true;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Requests", 14, 16);
    doc.autoTable({
      head: [
        [
          "EmployeeID",
          "First Name",
          "Last Name",
          "Type of Request",
          "Type of Leave",
          "Start Date",
          "End Date",
          "Duration",
          "Departure Time",
          "Return Time",
        ],
      ],
      body: filteredRequests.map((req) => [
        req.employeeId,
        req.firstName || "",
        req.lastName || "",
        req.type || "",
        req.leaveType || "-",
        formatDate(req.startDate) || "",
        formatDate(req.endDate) || "",
        calculateDuration(req.startDate, req.endDate) + " days" || "",
        req.departureTime || "",
        req.returnTime || "",
      ]),
    });
    doc.save("employeerequests.pdf");
    Swal.fire({
      icon: "success",
      title: "Download Complete!",
      text: "Your PDF has been downloaded successfully.",
    });
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRequests.map((req) => ({
        EmployeeID: req.employeeId || "",
        "First Name": req.firstName || "",
        "Last Name": req.lastName || "",
        "Type of Request": req.type || "",
        "Type of Leave": req.leaveType || "-",
        "Start Date": formatDate(req.startDate) || "",
        "End Date": formatDate(req.endDate) || "",
        Duration: calculateDuration(req.startDate, req.endDate) + " days" || "",
        "Departure Time": req.departureTime || "",
        "Return Time": req.returnTime || "",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");
    XLSX.writeFile(workbook, "employeerequests.xlsx");
    Swal.fire({
      icon: "success",
      title: "Download Complete!",
      text: "Your Excel file has been downloaded successfully.",
    });
  };

  const columns = [
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    {
      title: "Type of Request",
      dataIndex: "type",
      key: "type",
      render: (text) => <Tag color={getTypeTagColor(text)}>{text}</Tag>, // Use dynamic color for each type
    },
    {
      title: "Type of Leave",
      dataIndex: "leaveType",
      key: "leaveType",
      render: (text) => <Tag color={getLeaveTypeTagColor(text)}>{text}</Tag>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => formatDate(text),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Duration",
      key: "duration",
      render: (text, record) =>
        `${calculateDuration(record.startDate, record.endDate)} days`,
    },
    {
      title: "Departure Time",
      dataIndex: "departureTime",
      key: "departureTime",
    },
    {
      title: "Return Time",
      dataIndex: "returnTime",
      key: "returnTime",
    },
  ];

  return (
    <div className="flex flex-row h-screen">
      <SidebarHR sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1">
        <TopBar />
        <Card style={{ padding: 20, borderRadius: 10 }}>
          <div style={{ padding: 20 }}>
            <h2 className="text-2xl font-bold mb-4">Employee Requests</h2>
            <div className="mb-4">
              <Select
                defaultValue="All"
                style={{ width: 120 }}
                onChange={(value) => setFilter(value)}
              >
                <Option value="All">All</Option>
                <Option value="Leave">Leave</Option>
                <Option value="Mission">Mission</Option>
                <Option value="Authorization">Authorization</Option>
              </Select>
              <DatePicker
                className="ml-2"
                onChange={(date, dateString) => setFilterDate(dateString)}
              />
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faFilePdf} />}
                onClick={handleDownloadPDF}
                className="ml-2"
              >
                Download PDF
              </Button>
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faFileExcel} />}
                onClick={handleDownloadExcel}
                className="ml-2"
              >
                Download Excel
              </Button>
            </div>
            <Table
              dataSource={currentRequests}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
            <Pagination
              current={currentPage}
              total={filteredRequests.length}
              pageSize={requestsPerPage}
              onChange={paginate}
              className="mt-4"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomeHR;
