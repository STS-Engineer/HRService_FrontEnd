import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Table,
  Select,
  Form,
  Card,
  DatePicker,
  notification,
} from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const PointingReportRH = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    employee_id: "",
    date: "",
    status: "IN",
  });
  const [filters, setFilters] = useState({
    employee_id: "",
    date: "",
    employee_name: "",
  });
  // Fetch attendance data based on filters
  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const { employee_id, date, employee_name } = filters;
      let url = "https://bhr-avocarbon.azurewebsites.net/pointing/allattendance/";

      if (employee_id) {
        url = `https://bhr-avocarbon.azurewebsites.net/pointing/attendance/employee?employee_id=${employee_id}`;
      } else if (date) {
        url = `https://bhr-avocarbon.azurewebsites.net/pointing/attendance/date?date=${date}`;
      } else if (employee_name) {
        url = `https://bhr-avocarbon.azurewebsites.net/pointing/attendance/name?name=${employee_name}`;
      }

      const response = await axios.get(url);
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      notification.error({
        message: "Error",
        description: "There was an error fetching attendance data.",
      });
    }
  };

  // Insert new attendance record
  const handleInsertAttendance = async () => {
    try {
      await axios.post("https://bhr-avocarbon.azurewebsites.net/pointing/allattendance"); // Adjust the endpoint if needed
      notification.success({
        message: "Success",
        description: "Attendance records inserted successfully!",
      });
      fetchAttendance(); // Refresh attendance data
    } catch (error) {
      console.error("Error inserting attendance:", error);
      notification.error({
        message: "Error",
        description: "There was an error inserting attendance data.",
      });
    }
  };

  // Handle downloading attendance data as Excel
  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(
        "https://bhr-avocarbon.azurewebsites.net/pointing/attendance/export/excel",
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pointage.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      notification.error({
        message: "Error",
        description: "There was an error downloading the Excel file.",
      });
    }
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },
    {
      title: "Employee Name",
      key: "employee_id",
      render: (text, record) => (
        <span>
          {record.firstname} {record.lastname}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "Arrival Time",
      dataIndex: "arrival_time",
      key: "arrival_time",
      render: (text) =>
        text ? moment(text, "HH:mm:ss").format("HH:mm:ss") : "N/A",
    },
    {
      title: "Departure Time",
      dataIndex: "departure_time",
      key: "departure_time",
      render: (text) =>
        text ? moment(text, "HH:mm:ss").format("HH:mm:ss") : "N/A",
    },
    {
      title: "H_Min",
      dataIndex: "heure_min",
      key: "heure_min",
      render: (text) =>
        text ? moment(text, "HH:mm:ss").format("HH:mm:ss") : "N/A",
    },
    {
      title: "H_Max",
      dataIndex: "heure_max",
      key: "heure_max",
      render: (text) =>
        text ? moment(text, "HH:mm:ss").format("HH:mm:ss") : "N/A",
    },
    {
      title: "Working Hours",
      dataIndex: "working_hours_decimal",
      key: "working_hours_decimal",
      render: (text) => `${text} hrs`,
    },
    {
      title: "Motif",
      dataIndex: "motif",
      key: "motif",
      render: (text) => `${text} hrs`,
    },
  ];

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <div style={{ padding: 20 }}>
        <h2 className="text-2xl font-bold mb-4">Pointing Report</h2>
        {/* Filter Section */}
        <div className="flex flex-wrap gap-4">
          <Button
            type="primary"
            onClick={handleInsertAttendance}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          >
            Insert Attendance
          </Button>
          <Button
            onClick={handleDownloadExcel}
            icon={<DownloadOutlined />}
            type="default"
            className="mb-6"
          >
            Download Excel
          </Button>
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          <Input
            placeholder="Employee ID"
            value={filters.employee_id}
            onChange={(e) =>
              setFilters({ ...filters, employee_id: e.target.value })
            }
            className="w-full md:w-1/3"
          />
          <DatePicker
            value={filters.date ? moment(filters.date) : null}
            onChange={(date, dateString) =>
              setFilters({ ...filters, date: dateString })
            }
            className="w-full md:w-1/3"
          />
          <Input
            placeholder="Employee Name"
            value={filters.employee_name}
            onChange={(e) =>
              setFilters({ ...filters, employee_name: e.target.value })
            }
            className="w-full md:w-1/3"
          />
          <Button
            onClick={fetchAttendance}
            icon={<SearchOutlined />}
            type="primary"
            className="w-full md:w-auto"
          >
            Filter Attendance
          </Button>
        </div>

        {/* Attendance Table */}
        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="id"
          pagination={false}
        />
      </div>
    </Card>
  );
};

export default PointingReportRH;
