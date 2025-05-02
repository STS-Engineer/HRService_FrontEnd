import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  DatePicker,
  message,
  Space,
  Card,
  Tag,
  Spin,
} from "antd";
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
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const params = {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
        // You can optionally add employeeId if needed:
        // employeeId: currentUserId
      };

      const response = await axios.get(
        "https://bhr-avocarbon.azurewebsites.net/pointing/filter",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setData(response.data);
      filterData(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  const filterData = (logs) => {
    const filtered = logs.filter((log) => {
      const logDate = moment(log.log_time).startOf("day");

      const isInSearchTerm =
        log.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.lastname.toLowerCase().includes(searchTerm.toLowerCase());

      return isInSearchTerm;
    });

    const groupedData = groupLogsByEmployeeAndDate(filtered);
    setFilteredData(groupedData);
  };

  const groupLogsByEmployeeAndDate = (logs) => {
    const grouped = logs.reduce((acc, log) => {
      const employeeName = `${log.firstname} ${log.lastname}`;
      const logDate = moment(log.log_time).format("YYYY-MM-DD");

      if (!acc[employeeName]) acc[employeeName] = {};
      if (!acc[employeeName][logDate]) {
        acc[employeeName][logDate] = {
          date: logDate,
          in: null,
          out: null,
          late_status: log.late_status,
        };
      }

      if (log.status.toLowerCase() === "in")
        acc[employeeName][logDate].in = log.log_time;
      if (log.status.toLowerCase() === "out")
        acc[employeeName][logDate].out = log.log_time;

      return acc;
    }, {});

    const result = [];
    for (const employee in grouped) {
      for (const date in grouped[employee]) {
        result.push({
          employeeName: employee,
          logDate: date,
          logs: grouped[employee][date],
          late_status: grouped[employee][date].late_status,
        });
      }
    }

    return result;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterData(data);
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) return;
    setDateRange(dates);
  };

  const columns = [
    {
      title: "Employee Name",
      key: "employeeName",
      render: (text, record) => record.employeeName,
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
      width: "20%",
      responsive: ["sm"],
    },
    {
      title: "Log Date",
      key: "logDate",
      render: (text, record) => moment(record.logDate).format("DD-MM-YYYY"),
      sorter: (a, b) => (moment(a.logDate).isBefore(b.logDate) ? -1 : 1),
      width: "15%",
      responsive: ["sm"],
    },
    {
      title: "Pointing",
      key: "pointages",
      render: (text, record) => (
        <Space>
          {record.logs.in ? (
            <Tag
              color="green"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {moment(record.logs.in).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">Not Logged In</Tag>
          )}
          <span style={{ margin: "0 8px" }}>|</span>
          {record.logs.out ? (
            <Tag
              color="red"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {moment(record.logs.out).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">Not Logged Out</Tag>
          )}
        </Space>
      ),
      width: "30%",
    },
    {
      title: "Late Status",
      key: "lateStatus",
      render: (text, record) => (
        <Tag color={record.late_status === "Late" ? "red" : "green"}>
          {record.late_status}
        </Tag>
      ),
      filters: [
        { text: "Late", value: "Late" },
        { text: "On Time", value: "On Time" },
      ],
      onFilter: (value, record) =>
        record.late_status && record.late_status === value,
      width: "20%",
    },
  ];

  // Fetch logs on mount and when date range changes
  useEffect(() => {
    fetchLogs();
  }, [dateRange]);

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <div style={{ padding: 20 }}>
        <h2 className="text-2xl font-bold mb-4">Pointing Management</h2>
        <div className="flex items-center mb-4 space-x-4">
          <Input
            placeholder="Search by Employee Name"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: "250px" }}
          />
          <RangePicker
            onChange={handleDateChange}
            value={dateRange}
            style={{ width: "350px" }}
          />
          <Button
            type="primary"
            onClick={fetchLogs}
            icon={<SyncOutlined />}
            loading={loading}
          >
            Refresh Logs
          </Button>
        </div>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => `${record.employeeName}-${record.logDate}`}
            pagination={{ pageSize: 12 }}
            bordered
            scroll={{ x: 700 }}
            size="middle"
            sticky
            responsive
          />
        )}
      </div>
    </Card>
  );
};

export default PointingManagement;
