import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Tag,
  Card,
  Typography,
  Divider,
  Statistic,
} from "antd";
import {
  SyncOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const EmployeeLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weeklyHours, setWeeklyHours] = useState(0); // Store weekly hours
  const [filters, setFilters] = useState({ startDate: null, endDate: null });

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) {
        message.error(t("error.notAuthenticated"));
        return;
      }

      const { data } = await axios.get(
        `https://bhr-avocarbon.azurewebsites.net/pointing/logs/employee/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: filters.startDate, endDate: filters.endDate },
        }
      );

      const groupedLogs = data.reduce((acc, log) => {
        const date = moment(log.log_time).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = { date, in: null, out: null };
        if (log.status.toLowerCase() === "in") acc[date].in = log.log_time;
        else if (log.status.toLowerCase() === "out")
          acc[date].out = log.log_time;
        return acc;
      }, {});

      const logsArray = Object.values(groupedLogs).map((log) => ({
        ...log,
        in: log.in || t("logs.notLoggedIn"),
        out: log.out || t("logs.notLoggedOut"),
      }));

      setLogs(logsArray);
    } catch (error) {
      message.error(t("error.fetchLogs"));
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  useEffect(() => {
    calculateWeeklyHours(); // Calculate weekly hours on load
  }, [logs]); // Update when logs change

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
      message.success(t("logs.syncSuccess"));
      fetchLogs();
    } catch (error) {
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
      return 0; // Return 0 instead of JSX
    }

    let totalHours = moment
      .duration(moment(outTime).diff(moment(inTime)))
      .asHours();

    if (totalHours > 9) {
      totalHours -= 1;
    }

    return parseFloat(totalHours.toFixed(2)); // Ensure numeric return value
  };

  const calculateWeeklyHours = () => {
    const startOfWeek = moment().startOf("week").add(1, "days"); // Start from Monday
    const today = moment().format("YYYY-MM-DD");

    let weeklyTotal = logs.reduce((sum, log) => {
      const logDate = moment(log.date).format("YYYY-MM-DD");
      const workingHours = calculateWorkingHours(log.in, log.out); // Ensure numeric

      if (logDate >= startOfWeek.format("YYYY-MM-DD") && logDate <= today) {
        return sum + workingHours;
      }
      return sum;
    }, 0);

    setWeeklyHours(Number(weeklyTotal).toFixed(2)); // Convert safely
  };

  const columns = [
    {
      title: t("myPointing.date"),
      dataIndex: "date",
      key: "date",
      render: (text) => <Text strong>{moment(text).format("DD-MM-YYYY")}</Text>,
    },
    {
      title: t("myPointing.pointing"),
      key: "pointages",
      render: (_, record) => (
        <Space>
          {record.in !== t("logs.notLoggedIn") ? (
            <Tag color="green">
              <ClockCircleOutlined /> {moment(record.in).format("HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="red">{record.in}</Tag>
          )}
          <Divider type="vertical" />
          {record.out !== t("logs.notLoggedOut") ? (
            <Tag color="red">
              <ClockCircleOutlined /> {moment(record.out).format("HH:mm:ss")}
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
      render: (_, record) => (
        <Tag color="blue">
          {calculateWorkingHours(record.in, record.out)} {t("logs.hours")}
        </Tag>
      ),
    },
  ];

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <Title level={3}>{t("myPointing.title")}</Title>

      {/* 🟢 Weekly Hours Counter Dashboard */}
      <Card
        style={{
          marginBottom: 20,
          background: "#f6ffed",
          border: "1px solid #b7eb8f",
          borderRadius: 10,
          textAlign: "center",
        }}
      >
        <DashboardOutlined style={{ fontSize: 30, color: "#52c41a" }} />
        <Statistic
          title={t("dashboard.weeklyHours")}
          value={weeklyHours}
          precision={2}
          suffix={t("logs.hours")}
          valueStyle={{ color: "#52c41a", fontSize: 24 }}
        />
      </Card>

      <Space style={{ marginBottom: 16 }}>
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

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="date"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </Card>
  );
};

export default EmployeeLogs;
