import React, { useState } from "react";
import { Input, Button, Form, Select, InputNumber } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const AddEmployeeForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    id: "",
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
      await axios.post("http://localhost:3000/auth/register", values);
      Swal.fire({
        icon: "success",
        title: t("success_message_title"),
        text: t("success_message_text"),
      });
      navigate("/employee-management");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error_message_title"),
        text: error.response?.data?.message || t("error_message_text"),
      });
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const roles = ["EMPLOYEE", "MANAGER", "HRMANAGER", "PLANT_MANAGER", "CEO"];
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
    <div className="container mx-auto max-w-lg md:max-w-xl p-4 md:p-8">
      <Button
        onClick={handleBackClick}
        type="text"
        icon={<ArrowLeftOutlined />}
        className="mb-4"
        aria-label={t("back")}
      >
        {t("back")}
      </Button>
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {t("add_employee_title")}
      </h2>
      <Form layout="vertical" onFinish={handleSubmit} initialValues={formData}>
        <Form.Item
          label={t("employee_id")}
          name="id"
          rules={[{ required: true, message: t("employee_id_placeholder") }]}
        >
          <InputNumber
            min={1}
            value={formData.id}
            onChange={(value) => setFormData({ ...formData, id: value })}
            placeholder={t("employee_id_placeholder")}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label={t("first_name")}
          name="firstname"
          rules={[{ required: true, message: t("first_name_placeholder") }]}
        >
          <Input
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
            placeholder={t("first_name_placeholder")}
          />
        </Form.Item>
        <Form.Item
          label={t("last_name")}
          name="lastname"
          rules={[{ required: true, message: t("last_name_placeholder") }]}
        >
          <Input
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
            placeholder={t("last_name_placeholder")}
          />
        </Form.Item>
        <Form.Item
          label={t("department")}
          name="department"
          rules={[{ required: true, message: t("department_placeholder") }]}
        >
          <Input
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            placeholder={t("department_placeholder")}
          />
        </Form.Item>
        <Form.Item
          label={t("role")}
          name="role"
          rules={[{ required: true, message: t("select_role_placeholder") }]}
        >
          <Select
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
            placeholder={t("select_role_placeholder")}
          >
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("plant_connection")}
          name="plant_connection"
          rules={[{ required: true, message: t("select_plant_placeholder") }]}
        >
          <Select
            value={formData.plant_connection}
            onChange={(value) =>
              setFormData({ ...formData, plant_connection: value })
            }
            placeholder={t("select_plant_placeholder")}
          >
            {plantConnections.map((connection) => (
              <Option key={connection} value={connection}>
                {connection}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("email")}
          name="email"
          rules={[
            { required: true, message: t("email_placeholder"), type: "email" },
          ]}
        >
          <Input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={t("email_placeholder")}
          />
        </Form.Item>
        <Form.Item
          label={t("password")}
          name="password"
          rules={[{ required: true, message: t("password") }]}
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
            className="bg-blue-500 text-white w-full md:w-auto"
          >
            {t("submit_button")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEmployeeForm;
