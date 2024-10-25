import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import {
  UserSwitchOutlined,
  FileDoneOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons"; // Ensure to import the required icons
import axios from "axios";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

const { Title } = Typography;

const Dashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [requestsPerEmployee, setRequestsPerEmployee] = useState([]);
  const [employeesOnLeaveToday, setEmployeesOnLeaveToday] = useState([]);
  const [barChartData, setBarChartData] = useState({ labels: [], values: [] });
  const [pieChartData, setPieChartData] = useState({
    labels: ["Leave", "Mission", "Authorization"],
    values: [],
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/dashboard/general-statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    const fetchRequestsPerEmployee = async (employeeID = null) => {
      try {
        let url = "https://bhr-avocarbon.azurewebsites.net/dashboard/requests-per-employee";
        if (employeeID) {
          url += `?employeeID=${employeeID}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequestsPerEmployee(response.data);

        const labels = Object.keys(response.data).map(
          (employeeId) =>
            `${response.data[employeeId].firstname} ${response.data[employeeId].lastname}`
        );
        const values = Object.values(response.data).map(
          (req) => req.total_requests
        );

        setBarChartData({ labels, values });
      } catch (error) {
        console.error("Error fetching requests per employee:", error);
      }
    };

    const fetchEmployeesOnLeaveToday = async () => {
      try {
        const response = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/dashboard/employees-on-leave-today",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployeesOnLeaveToday(response.data);
      } catch (error) {
        console.error("Error fetching employees on leave today:", error);
      }
    };

    const fetchTotalRequestsForPieChart = async () => {
      try {
        const response = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/dashboard/general-statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const pieValues = [
          response.data.total_leave_requests,
          response.data.total_mission_requests,
          response.data.total_authorization_requests,
        ];
        setPieChartData({ ...pieChartData, values: pieValues });
      } catch (error) {
        console.error("Error fetching total requests for pie chart:", error);
      }
    };

    fetchStatistics();
    fetchRequestsPerEmployee();
    fetchEmployeesOnLeaveToday();
    fetchTotalRequestsForPieChart();
  }, []);

  const requestsTableData = Object.entries(requestsPerEmployee).map(
    ([employeeId, { total_requests, firstname, lastname }]) => ({
      key: employeeId,
      employeeId,
      firstname: `${firstname} `,
      lastname: `${lastname} `,
      totalRequests: total_requests,
    })
  );

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Total Requests",
      dataIndex: "totalRequests",
      key: "totalRequests",
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px", textAlign: "center" }}>
        Dashboard
      </Title>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Total Leave Requests"
              value={statistics.total_leave_requests}
              valueStyle={{ color: "#3f8600" }}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Total Mission Requests"
              value={statistics.total_mission_requests}
              valueStyle={{ color: "#3f8600" }}
              prefix={<FileDoneOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Total Authorization Requests"
              value={statistics.total_authorization_requests}
              valueStyle={{ color: "#3f8600" }}
              prefix={<SecurityScanOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            title={
              <span>
                <TeamOutlined style={{ marginRight: 8 }} /> Requests Per
                Employee
              </span>
            }
          >
            <Table
              dataSource={requestsTableData}
              columns={columns}
              pagination={false}
              size="small"
              scroll={{ y: 240 }}
              style={{ overflowX: "auto" }} // Allow table to scroll horizontally on small screens
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            title={
              <span>
                <UserSwitchOutlined style={{ marginRight: 8 }} /> Employees On
                Leave Today
              </span>
            }
          >
            <Table
              dataSource={employeesOnLeaveToday.map((employee) => ({
                key: employee.id,
                name: `${employee.firstname} ${employee.lastname}`,
              }))}
              columns={[{ title: "Name", dataIndex: "name", key: "name" }]}
              pagination={false}
              size="small"
              scroll={{ y: 240 }}
              style={{ overflowX: "auto" }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span>
                <BarChartOutlined style={{ marginRight: 8 }} /> Total Requests
                Per Employee
              </span>
            }
          >
            <div style={{ overflowX: "auto" }}>
              {" "}
              {/* Scrollable charts */}
              <BarChart data={barChartData} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            title={
              <span>
                <PieChartOutlined style={{ marginRight: 8 }} /> Requests
                Distribution
              </span>
            }
          >
            <div style={{ overflowX: "auto" }}>
              <PieChart data={pieChartData} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
