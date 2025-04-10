import React, { useState, useEffect } from "react";
import { Steps, Form, Input, Button, Select, InputNumber } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Step } = Steps;

const AddEmployeeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [horaires, setHoraires] = useState([]);

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

  // Fetch departments and horaires from backend on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await axios.get(
          "http://localhost:3000/departments"
        );
        const horairesResponse = await axios.get(
          "http://localhost:3000/horaires"
        );

        setDepartments(deptResponse.data);
        setHoraires(horairesResponse.data);
      } catch (error) {
        console.error("Error fetching departments and horaires:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await axios.post("https://bhr-avocarbon.azurewebsites.net/auth/register", values);
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

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const handleBackClick = () => {
    if (currentStep === 0) {
      window.history.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto max-w-lg md:max-w-2xl p-6 md:p-10 bg-white shadow-lg rounded-lg">
      <Button
        onClick={handleBackClick}
        type="text"
        icon={<ArrowLeftOutlined />}
        className="mb-4"
      >
        {t("back")}
      </Button>

      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
        {t("add_employee_title")}
      </h2>

      <Steps current={currentStep} className="mb-6">
        <Step title={t("")} description={t("")} />
        <Step title={t("")} description={t("")} />
        <Step title={t("")} description={t("")} />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {currentStep === 0 && (
          <>
            <Form.Item
              label={t("employee_id")}
              name="id"
              rules={[
                { required: true, message: t("employee_id_placeholder") },
              ]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={t("first_name")}
              name="firstname"
              rules={[{ required: true, message: t("first_name_placeholder") }]}
            >
              <Input placeholder={t("first_name_placeholder")} />
            </Form.Item>

            <Form.Item
              label={t("last_name")}
              name="lastname"
              rules={[{ required: true, message: t("last_name_placeholder") }]}
            >
              <Input placeholder={t("last_name_placeholder")} />
            </Form.Item>

            <Form.Item
              label={t("department")}
              name="department"
              rules={[{ required: true, message: t("department_placeholder") }]}
            >
              <Select placeholder={t("select_department")}>
                {departments.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("profil.profile.function")}
              name="function"
              rules={[
                { required: true, message: t("profil.profile.enterFunction") },
              ]}
            >
              <Input placeholder={t("profil.profile.enterFunction")} />
            </Form.Item>

            <div className="flex justify-end">
              <Button type="primary" onClick={handleNext}>
                {t("next")}
              </Button>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item
              label={t("horaire")}
              name="horaire"
              rules={[
                { required: true, message: t("select_horaire_placeholder") },
              ]}
            >
              <Select placeholder={t("select_horaire_placeholder")}>
                {horaires.map((horaire) => (
                  <Option key={horaire.id} value={horaire.id}>
                    {horaire.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="flex justify-between">
              <Button onClick={() => setCurrentStep(0)}>{t("previous")}</Button>
              <Button type="primary" onClick={handleNext}>
                {t("next")}
              </Button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Form.Item
              label={t("role")}
              name="role"
              rules={[
                { required: true, message: t("select_role_placeholder") },
              ]}
            >
              <Select placeholder={t("select_role_placeholder")}>
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
              rules={[
                { required: true, message: t("select_plant_placeholder") },
              ]}
            >
              <Select placeholder={t("select_plant_placeholder")}>
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
                {
                  required: true,
                  message: t("email_placeholder"),
                  type: "email",
                },
              ]}
            >
              <Input placeholder={t("email_placeholder")} />
            </Form.Item>

            <Form.Item
              label={t("password")}
              name="password"
              rules={[{ required: true, message: t("password_placeholder") }]}
            >
              <Input.Password />
            </Form.Item>

            <div className="flex justify-between">
              <Button onClick={() => setCurrentStep(0)}>{t("previous")}</Button>
              <Button type="primary" htmlType="submit">
                {t("submit_button")}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default AddEmployeeForm;
