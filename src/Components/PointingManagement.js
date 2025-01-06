import React, { useEffect, useState } from "react";
import { Table, Button, Input, DatePicker, message, Space, Tag } from "antd";
import {
  SearchOutlined,
  SyncOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;

const PointingManagement = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  // Fetch logs from the API
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/pointing/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      filterData(response.data, dateRange); // Filter immediately after fetching
    } catch (error) {
      message.error("Failed to fetch logs.");
    }
  };

  const filterData = (logs, dateRange) => {
    // Filter logs by date range and search term
    const filtered = logs.filter((log) => {
      const logDate = moment(log.log_time).startOf("day");
      const isInDateRange = logDate.isBetween(
        moment(dateRange[0]).startOf("day"),
        moment(dateRange[1]).endOf("day"),
        "day",
        "[]"
      );
      const isInSearchTerm =
        log.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.lastname.toLowerCase().includes(searchTerm.toLowerCase());

      return isInDateRange && isInSearchTerm;
    });

    // Group filtered logs by employee and date
    const groupedData = groupLogsByEmployeeAndDate(filtered);
    setFilteredData(groupedData);
  };

  const groupLogsByEmployeeAndDate = (logs) => {
    const grouped = logs.reduce((acc, log) => {
      const employeeName = `${log.firstname} ${log.lastname}`;
      const logDate = moment(log.log_time).format("YYYY-MM-DD");

      if (!acc[employeeName]) {
        acc[employeeName] = {};
      }

      if (!acc[employeeName][logDate]) {
        acc[employeeName][logDate] = { date: logDate, in: null, out: null };
      }

      if (log.status.toLowerCase() === "in") {
        acc[employeeName][logDate].in = log.log_time;
      } else if (log.status.toLowerCase() === "out") {
        acc[employeeName][logDate].out = log.log_time;
      }

      return acc;
    }, {});

    // Convert grouped data into an array for rendering in the table
    const result = [];
    for (const employee in grouped) {
      for (const date in grouped[employee]) {
        result.push({
          employeeName: employee,
          logDate: date,
          logs: grouped[employee][date],
        });
      }
    }

    return result;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterData(data, dateRange); // Filter based on the search term and current date range
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) return;
    setDateRange(dates);
    filterData(data, dates); // Re-filter the data based on the new date range
  };

  const columns = [
    {
      title: "Employee Name",
      key: "employeeName",
      render: (text, record) => record.employeeName,
    },
    {
      title: "Log Date",
      key: "logDate",
      render: (text, record) => record.logDate,
    },
    {
      title: "Pointing",
      key: "pointages",
      render: (text, record) => (
        <Space>
          {record.logs.in !== "Not Logged In" ? (
            <Tag
              color="green"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {moment(record.logs.in).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">{record.logs.in}</Tag>
          )}
          <span style={{ margin: "0 8px" }}>|</span>
          {record.logs.out !== "Not Logged Out" ? (
            <Tag
              color="red"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {moment(record.logs.out).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">{record.logs.out}</Tag>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchLogs(); // Fetch logs on component mount
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pointing Management</h2>
      <div className="flex items-center mb-4 space-x-4">
        <Input
          placeholder="Search by Employee Name"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {/* <RangePicker
          onChange={handleDateChange}
          suffixIcon={<CalendarOutlined />}
          defaultValue={dateRange}
        /> */}
        <Button type="primary" onClick={fetchLogs} icon={<SyncOutlined />}>
          Refresh Logs
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="logDate"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PointingManagement;
