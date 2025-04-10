import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Card,
  Tag,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Option } = Select;

const roleColors = {
  EMPLOYEE: "blue",
  MANAGER: "green",
  HRMANAGER: "purple",
  PLANT_MANAGER: "orange",
  CEO: "red",
};

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://bhr-avocarbon.azurewebsites.net/auth/employees-by-plant",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees", error.response.data.error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        await axios.delete(`https://bhr-avocarbon.azurewebsites.net/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEmployees(employees.filter((employee) => employee.id !== id));
        Swal.fire("Deleted!", "The employee has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      Swal.fire("Error!", "There was an issue deleting the employee.", "error");
    }
  };

  const handleEdit = (record) => {
    setSelectedEmployee(record);
    setIsModalVisible(true);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      responsive: ["lg"],
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
      title: "Department",
      dataIndex: "department",
      key: "department",
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={roleColors[role] || "default"}>{role}</Tag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <a href={`mailto:${email}`} className="text-blue-500 underline">
          {email}
        </a>
      ),
    },
    {
      title: "Plant Connection",
      dataIndex: "plant_connection",
      key: "plant_connection",
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <Card className="p-4 rounded-lg shadow-md">
      <div style={{ padding: 20 }}>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Employee Management
        </h2>
        <Row justify="space-between" align="middle" className="mb-4">
          <Col span={24} sm={8} md={6}>
            <Link to="/add-employee">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="middle"
                className="w-auto px-3 py-1"
              >
                Add New Employee
              </Button>
            </Link>
          </Col>
        </Row>

        <Table
          dataSource={employees}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          scroll={{ x: true }}
          size="small"
          className="overflow-x-auto"
        />
        <Modal
          title="Edit Employee"
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width="90%"
        >
          {selectedEmployee && (
            <EditEmployeeForm
              record={selectedEmployee}
              onClose={handleCloseModal}
              onUpdate={handleUpdateEmployee}
            />
          )}
        </Modal>
      </div>
    </Card>
  );
};

// Edit Employee Form component
const EditEmployeeForm = ({ record, onClose, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [record, form]);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://bhr-avocarbon.azurewebsites.net/auth/user/${record.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success!", "Employee updated successfully!", "success");
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      Swal.fire("Error!", "There was an issue updating the employee.", "error");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="First Name" name="firstname">
        <Input />
      </Form.Item>
      <Form.Item label="Last Name" name="lastname">
        <Input />
      </Form.Item>
      <Form.Item label="Role" name="role">
        <Select>
          {Object.keys(roleColors).map((role) => (
            <Option key={role} value={role}>
              {role}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeManagement;
