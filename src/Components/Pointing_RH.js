import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  message,
  Pagination,
  List,
  Avatar,
  Typography,
  Space,
} from "antd";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

const { Text } = Typography;

const PointingManagementRH = () => {
  const [pointeuses, setPointeuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [selectedPointeuse, setSelectedPointeuse] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fetch pointeuses from API
  useEffect(() => {
    const fetchPointeuses = async () => {
      try {
        const response = await fetch("https://bhr-avocarbon.azurewebsites.net/pointing/devices");
        if (!response.ok) throw new Error("Failed to fetch machines");

        const data = await response.json();
        setPointeuses(data);
      } catch (error) {
        console.error("Error fetching pointeuses:", error);
        message.error("Failed to fetch machines");
      } finally {
        setLoading(false);
      }
    };

    fetchPointeuses();
  }, [refreshKey]);

  // Fetch employees for a specific pointeuse
  // const fetchEmployees = async (deviceIp) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/pointing/employees?device_ip=${deviceIp}`
  //     );
  //     if (!response.ok) throw new Error("Failed to fetch employees");

  //     const data = await response.json();
  //     setEmployees(data);
  //     setEmployeeModalVisible(true);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //     message.error("Failed to fetch employees");
  //   }
  // };
  // Fetch employees for a specific pointeuse and show in modal
  const fetchEmployees = async (pointeuse) => {
    try {
      const response = await fetch(
        `https://bhr-avocarbon.azurewebsites.net/pointing/pointeuses/${pointeuse.id}/employees`
      );
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(data);
      setSelectedPointeuse(pointeuse); // Store the selected machine
      setEmployeeModalVisible(true);
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees");
    }
  };

  // Delete a pointeuse
  const handleDeletePointeuse = async (id) => {
    try {
      const response = await fetch(
        `https://bhr-avocarbon.azurewebsites.net/pointing/delete-device/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete machine");

      message.success("Machine deleted successfully");
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error deleting pointeuse:", error);
      message.error("Failed to delete machine");
    }
  };

  // Handle adding a new pointeuse
  const handleAddPointeuse = async (values) => {
    try {
      const response = await fetch(
        "https://bhr-avocarbon.azurewebsites.net/pointing/add-device",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to add machine");

      const newPointeuse = await response.json();
      setPointeuses((prev) => [...prev, newPointeuse]);
      message.success("Machine added successfully");
      setIsModalVisible(false);
      form.resetFields();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error adding pointeuse:", error);
      message.error("Failed to add machine");
    }
  };

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <div style={{ padding: "20px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Machine Management
        </h2>

        {/* Add New Pointeuse Button */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Machine
        </Button>
        {/* Machines List */}
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            pointeuses
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((pointeuse) => (
                <Col key={pointeuse.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt="Machine"
                        src="./pointeuses.png"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      />
                    }
                  >
                    <Card.Meta
                      title={pointeuse.device_name}
                      description={`IP: ${pointeuse.device_ip}`}
                    />
                    <div
                      style={{ marginTop: "10px", display: "flex", gap: "8px" }}
                    >
                      {/* Eye Icon for View Employees */}
                      <Button
                        type="primary"
                        icon={<EyeIcon className="h-5 w-5" />}
                        onClick={() => fetchEmployees(pointeuse)} // Pass the full object
                      >
                        View Employees
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))
          )}
        </Row>
        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={pointeuses.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Modal for Adding Pointeuse */}
        <Modal
          title="Add New Machine"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddPointeuse}>
            <Form.Item
              name="device_name"
              label="Machine Name"
              rules={[
                { required: true, message: "Please enter the machine name" },
              ]}
            >
              <Input placeholder="Enter machine name" />
            </Form.Item>
            <Form.Item
              name="device_ip"
              label="IP Address"
              rules={[
                { required: true, message: "Please enter the IP address" },
              ]}
            >
              <Input placeholder="Enter IP address" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Add Machine
            </Button>
          </Form>
        </Modal>

        {/* Modal for Viewing Employees */}
        <Modal
          title={
            <Text strong style={{ fontSize: "18px" }}>
              Employees in {selectedPointeuse?.device_name || "Machine"}
            </Text>
          }
          open={employeeModalVisible}
          onCancel={() => setEmployeeModalVisible(false)}
          footer={null}
        >
          <List
            bordered
            dataSource={employees}
            renderItem={(employee) => (
              <List.Item>
                <Space>
                  <Avatar size="large" icon={<UserOutlined />} />
                  <Text
                    strong
                  >{`${employee.id} - ${employee.firstname} ${employee.lastname}`}</Text>
                </Space>
              </List.Item>
            )}
            style={{ maxHeight: "400px", overflowY: "auto" }} // Scrollable list
          />
        </Modal>
      </div>
    </Card>
  );
};

export default PointingManagementRH;
