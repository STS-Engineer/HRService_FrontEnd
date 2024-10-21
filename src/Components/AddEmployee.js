import React, { useState } from "react";
import { Input, Button, Form, Select } from "antd"; // Import Select here
import { ArrowLeftOutlined } from "@ant-design/icons"; // Using Ant Design's arrow icon
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const { Option } = Select; // Destructure Option from Select

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    department: "",
    email: "",
    password: "",
    role: "",
    plant_connection: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await axios.post("http://bhr-avocarbon.azurewebsites.net/auth/register", values);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Employee added successfully!",
      });
      navigate("/employee-management");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error adding employee",
      });
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  // Define the available roles
  const roles = ["EMPLOYEE", "MANAGER", "HRMANAGER", "PLANT_MANAGER", "CEO"]; // Updated roles
  const plantConnections = [
    "AVOCarbon Kunshan",
    "AVOCarbon Tianjin",
    "AVOCarbon France (Poitiers)",
    "Cyclam",
    "AVOCarbon Germany",
    "AVOCarbon India",
    "AVOCarbon Korea",
    "Assymex Monterrey",
    "AVOCarbon Tunisia",
  ];

  return (
    <div className="container mx-auto p-4">
      <Button
        onClick={handleBackClick}
        type="text"
        icon={<ArrowLeftOutlined />}
        className="mb-4"
        aria-label="Back"
      >
        Back
      </Button>
      <h2 className="text-xl font-bold mb-4">Add Employee</h2>
      <Form layout="vertical" onFinish={handleSubmit} initialValues={formData}>
        <Form.Item
          label="First Name"
          name="firstname"
          rules={[{ required: true, message: "Please input the first name!" }]}
        >
          <Input
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastname"
          rules={[{ required: true, message: "Please input the last name!" }]}
        >
          <Input
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: "Please input the department!" }]}
        >
          <Input
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]} // Updated message
        >
          <Select
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            placeholder="Select a role"
          >
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Plant Connection"
          name="plant_connection"
          rules={[
            { required: true, message: "Please select a plant connection!" },
          ]}
        >
          <Select
            value={formData.plant_connection}
            onChange={(value) =>
              setFormData({ ...formData, plant_connection: value })
            }
            placeholder="Select a plant connection"
          >
            {plantConnections.map((connection) => (
              <Option key={connection} value={connection}>
                {connection}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input a valid email!",
              type: "email",
            },
          ]}
        >
          <Input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input.Password
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 text-white"
          >
            Add Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEmployeeForm;
