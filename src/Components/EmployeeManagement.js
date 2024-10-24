import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Select, Row, Col } from "antd"; // Import necessary components
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Option } = Select;

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees
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

        // Make the delete request to the API
        await axios.delete(`https://bhr-avocarbon.azurewebsites.net/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the state by filtering out the deleted employee
        setEmployees(employees.filter((employee) => employee.id !== id));

        // Show success message
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
      title: "Employee ID",
      dataIndex: "id",
      key: "id",
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
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <a
          href={`mailto:${email}`}
          style={{ color: "#1890ff", textDecoration: "underline" }}
        >
          {email}
        </a>
      ),
    },
    {
      title: "Plant Connection",
      dataIndex: "plant_connection",
      key: "plant_connection",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)} // Trigger modal
            size="small" // Smaller button for mobile
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <h2 className="text-xl font-semibold">Employee Management</h2>
        </Col>
        <Col>
          <Link to="/add-employee">
            <Button type="primary" icon={<PlusOutlined />}>
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
        pagination={{ pageSize: 12 }}
        scroll={{ x: true }} // Add horizontal scroll for small screens
      />

      <Modal
        title="Edit Employee"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
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
      const token = localStorage.getItem("token"); // Get the token from local storage

      // Send the PUT request to update the employee details
      const response = await axios.put(
        `https://bhr-avocarbon.azurewebsites.net/auth/user/${record.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the authorization header
          },
        }
      );

      Swal.fire("Success!", "Employee updated successfully!", "success");
      onUpdate(response.data);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating employee:", error);
      Swal.fire("Error!", "There was an issue updating the employee.", "error");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Employee ID" name="id">
        <Input disabled />
      </Form.Item>
      <Form.Item name="firstname" label="First Name">
        <Input />
      </Form.Item>
      <Form.Item name="lastname" label="Last Name">
        <Input />
      </Form.Item>
      <Form.Item name="department" label="Department">
        <Input />
      </Form.Item>
      <Form.Item name="role" label="Role">
        <Select>
          <Option value="EMPLOYEE">Employee</Option>
          <Option value="MANAGER">Manager</Option>
          <Option value="HRMANAGER">HR Manager</Option>
          <Option value="PLANT_MANAGER">Plant Manager</Option>
          <Option value="CEO">CEO</Option>
        </Select>
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input />
      </Form.Item>
      <Form.Item name="plant_connection" label="Plant Connection">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Employee
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeManagement;
