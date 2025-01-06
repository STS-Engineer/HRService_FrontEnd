import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Checkbox, Typography, Select } from "antd";
import Swal from "sweetalert2"; // Import SweetAlert
import "antd/dist/reset.css";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";

const { Title } = Typography;

const Login = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [plantConnection, setPlantConnection] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [welcomeText, setWelcomeText] = useState("");
  const navigate = useNavigate();
  const { Option } = Select;
  const welcomeMessage = "Welcome to AVOCarbon HR Service";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= welcomeMessage.length) {
        setWelcomeText(welcomeMessage.substring(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          currentIndex = 0;
          setWelcomeText("");
        }, 3500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: values.username,
        password: values.password,
        plant_connection: values.plantConnection,
      });

      if (response.data.token && response.data.user) {
        const { firstname, role } = response.data.user;

        // Use sessionStorage if rememberMe is not checked
        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }
        console.log(response.data);

        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Show success notification using SweetAlert
        Swal.fire({
          icon: "success",
          title: t("login.loginSuccessTitle"),
          text: t("login.loginSuccessMessage", { firstname }),
          timer: 1500,
          showConfirmButton: false,
        });

        const userRole = response.data.user.role;
        navigate(`/${getRedirectPath(userRole)}`);

        // Optionally, reset the form fields
        setUsername("");
        setPassword("");
        setPlantConnection("");
      } else {
        Swal.fire({
          icon: "error",
          title: t("login.loginFailureTitle"),
          text: t("login.loginFailureMessage"),
        });
      }
    } catch (error) {
      Swal.fire(
        t("login.loginErrorTitle"),
        t("login.loginErrorMessage"),
        "error"
      );
    }
  };

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe) {
      const savedUsername = localStorage.getItem("username");
      const savedPassword = localStorage.getItem("password");

      if (savedUsername && savedPassword) {
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    }
  }, []);

  const getRedirectPath = (role) => {
    switch (role) {
      case "EMPLOYEE":
        return "home";
      case "MANAGER":
        return "home-admin";
      case "HRMANAGER":
        return "home-rh";
      case "PLANT_MANAGER":
        return "home-admin";
      default:
        return "";
    }
  };
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-orange-500 p-4">
      <div className="background-svg">
        <div className="absolute top-4 left-4">
          <img
            src="/image.png"
            alt="AVOCarbon Group Logo"
            className="w-48 h-auto lg:w-64"
          />
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <Select
          defaultValue={i18n.language}
          style={{ width: 120 }}
          onChange={changeLanguage}
          className="flex items-center space-x-2"
        >
          <Option value="en">
            <div className="flex items-center">
              <Flag
                code="US"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              English
            </div>
          </Option>
          <Option value="fr">
            <div className="flex items-center">
              <Flag
                code="FR"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              Français
            </div>
          </Option>
          <Option value="zh">
            <div className="flex items-center">
              <Flag
                code="CN"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              中文
            </div>
          </Option>
          <Option value="es">
            <div className="flex items-center">
              <Flag
                code="ES"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              Español
            </div>
          </Option>
          <Option value="de">
            <div className="flex items-center">
              <Flag
                code="DE"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              Deutsch
            </div>
          </Option>
          <Option value="hi">
            <div className="flex items-center">
              <Flag
                code="IN"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              हिन्दी
            </div>
          </Option>
          <Option value="tr">
            <div className="flex items-center">
              <Flag
                code="TR"
                style={{ width: 20, height: 15, marginRight: 8 }}
              />
              Türkçe
            </div>
          </Option>
        </Select>
      </div>

      <div className="login-container">
        <div className="text-center text-orange-500 text-2xl font-bold mb-6">
          {t("login.welcomeMessage")}
        </div>
        <Title level={2} className="text-center">
          {t("login.signInTitle")}
        </Title>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ remember: rememberMe }}
          className="login-form"
        >
          <Form.Item
            label={t("login.emailLabel")}
            name="username"
            rules={[{ required: true, message: t("login.emailLabel") }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("login.emailLabel")}
            />
          </Form.Item>

          <Form.Item
            label={t("login.passwordLabel")}
            name="password"
            rules={[{ required: true, message: t("login.passwordLabel") }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordLabel")}
            />
          </Form.Item>
          <Form.Item
            label={t("login.plantConnectionLabel")}
            name="plantConnection"
            rules={[
              {
                required: true,
                message: t("login.plantConnectionLabel"),
              },
            ]}
          >
            <Select
              value={plantConnection}
              onChange={(value) => setPlantConnection(value)} // Handle plant connection selection
              placeholder={t("login.selectPlantPlaceholder")}
              showSearch
              optionFilterProp="children"
            >
              <Option value="AVOCarbon Kunshan">{t("plants.kunshan")}</Option>
              <Option value="AVOCarbon Tianjin">{t("plants.tianjin")}</Option>
              <Option value="AVOCarbon France">{t("plants.france")}</Option>
              <Option value="Cyclam">{t("plants.cyclam")}</Option>
              <Option value="AVOCarbon Germany">{t("plants.germany")}</Option>
              <Option value="AVOCarbon India">{t("plants.india")}</Option>
              <Option value="AVOCarbon Korea">{t("plants.korea")}</Option>
              <Option value="AVOCarbon Tunisia">{t("plants.tunisia")}</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              {t("login.rememberMe")}
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              {t("login.loginButton")}
            </Button>
          </Form.Item>
        </Form>
        {/* <div className="text-center mt-4">
          <a
            href="/reset-password"
            className="font-medium text-gray-500 hover:text-orange-500"
          >
            Forgot your password? Reset Password
          </a>
        </div> */}

        {/* <div className="mt-8">
          <p className="text-center text-sm font-medium text-gray-700">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-orange-500 hover:text-orange-700"
            >
              Register here
            </a>
          </p>
        </div> */}
      </div>
      <div
        style={{
          position: "absolute",
          right: "16%",
          padding: "1rem",
          backgroundColor: "#f6f5fb",
          borderRadius: "100%",
        }}
      >
        <img
          src="/1267633.png"
          alt="Logo"
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>
  );
};

export default Login;
