import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Tag } from "antd";
import {
  SyncOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const EmployeeLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ startDate: null, endDate: null });

  // Fetch logs from the API
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        console.error("Token or user not found");
        message.error(t("error.notAuthenticated"));
        return;
      }

      const { data } = await axios.get(
        `https://bhr-avocarbon.azurewebsites.net/pointing/logs/employee/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        }
      );

      // Group logs by date
      const groupedLogs = data.reduce((acc, log) => {
        const date = moment(log.log_time).format("YYYY-MM-DD");
        if (!acc[date]) {
          acc[date] = { date, in: null, out: null };
        }
        if (log.status.toLowerCase() === "in") {
          acc[date].in = log.log_time;
        } else if (log.status.toLowerCase() === "out") {
          acc[date].out = log.log_time;
        }
        return acc;
      }, {});

      // Convert grouped logs to an array
      const logsArray = Object.values(groupedLogs).map((log) => ({
        ...log,
        in: log.in || t("logs.notLoggedIn"),
        out: log.out || t("logs.notLoggedOut"),
      }));

      setLogs(logsArray);
    } catch (error) {
      console.error(t("error.fetchLogs"), error.response || error.message);
      message.error(t("error.fetchLogs"));
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const syncLogs = async () => {
    try {
      setLoading(true);

      // Call the sync API for device logs
      await axios.post("https://bhr-avocarbon.azurewebsites.net/pointing/sync");
      message.success(t("logs.syncSuccess"));

      // Call the update pointing statuses API
      await axios.post(
        "https://bhr-avocarbon.azurewebsites.net/pointing/update-pointing-statuses"
      );
      message.success(t("logs.updateSuccess"));

      // Refresh logs after syncing
      fetchLogs();
    } catch (error) {
      console.error(t("error.syncLogs"), error);
      message.error(t("error.syncLogs"));
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkingHours = (inTime, outTime) => {
    if (
      inTime === t("logs.notLoggedIn") ||
      outTime === t("logs.notLoggedOut")
    ) {
      return (
        <Tag
          color="red"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {t("logs.insufficientData")}
        </Tag>
      );
    }

    // Parse times
    const startTime = moment(inTime);
    const endTime = moment(outTime);

    // Calculate total hours worked (subtract 1 hour for lunch break)
    const totalHours = moment.duration(endTime.diff(startTime)).asHours() - 1;

    // Format total hours for display
    const formattedHours = totalHours.toFixed(2);

    // Determine tag color
    const getTagColor = (hours) => {
      if (hours >= 8) return "green"; // 8 or more hours
      if (hours >= 7.5) return "orange"; // Between 7.5 and 7.99 hours
      return "red"; // Less than 7.5 hours
    };

    // Get color based on hours worked
    const color = getTagColor(totalHours);

    // Return styled tag
    return (
      <Tag
        color={color}
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <ClockCircleOutlined style={{ marginRight: 4 }} />
        {formattedHours} {t("logs.hours")}
      </Tag>
    );
  };
  const columns = [
    {
      title: t("myPointing.date"),
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: t("myPointing.pointing"),
      key: "pointages",
      render: (text, record) => (
        <Space>
          {record.in !== t("logs.notLoggedIn") ? (
            <Tag
              color="green"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {moment(record.in).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">{record.in}</Tag>
          )}
          <span style={{ margin: "0 8px" }}>|</span>
          {record.out !== t("logs.notLoggedOut") ? (
            <Tag
              color="red"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {moment(record.out).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">{record.out}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: t("myPointing.workingHours"),
      key: "workingHours",
      render: (text, record) => calculateWorkingHours(record.in, record.out),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ marginBottom: 16, marginTop: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={fetchLogs}
            loading={loading}
          >
            {t("buttons.loadLogs")}
          </Button>
          <Button
            type="dashed"
            icon={<SyncOutlined />}
            onClick={syncLogs}
            loading={loading}
          >
            {t("buttons.syncLogs")}
          </Button>
        </Space>
      </Space>
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="date"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default EmployeeLogs;
