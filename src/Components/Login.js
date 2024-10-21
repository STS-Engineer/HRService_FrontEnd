import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Checkbox, Typography, Select } from "antd";
import Swal from "sweetalert2"; // Import SweetAlert
import "antd/dist/reset.css";

const { Title } = Typography;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [plantConnection, setPlantConnection] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
      const response = await axios.post("http://bhr-avocarbon.azurewebsites.net/auth/login", {
        email: values.username,
        password: values.password,
        plant_connection: values.plantConnection,
      });

      if (response.data.token && response.data.user) {
        const { firstname, role } = response.data.user;

        // Store token and user data
        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("rememberMe", "true"); // Save rememberMe state
        } else {
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("rememberMe", "false");
        }
        console.log(response.data);

        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Show success notification using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back !`,
          timer: 1500,
          showConfirmButton: false,
        });

        const userRole = response.data.user.role;
        navigate(`/${getRedirectPath(userRole)}`);
      } else {
        Swal.fire("Invalid Credentials", "Please try again", "error");
      }
    } catch (error) {
      Swal.fire(
        "Login Failed",
        "Password or plant connection incorrect. Please try again.",
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

      <div className="login-container">
        <div className="text-center text-orange-500 text-2xl font-bold mb-6">
          {welcomeText}
        </div>
        <Title level={2} className="text-center">
          Sign In
        </Title>

        <Form
          name="login_form"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ remember: rememberMe }}
          className="login-form"
        >
          <Form.Item
            label="Email"
            name="username"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            label="Plant Connection"
            name="plantConnection"
            rules={[
              {
                required: true,
                message: "Please select your plant connection!",
              },
            ]}
          >
            <Select
              value={plantConnection}
              onChange={(value) => setPlantConnection(value)} // Handle plant connection selection
              placeholder="Select Plant Connection"
              showSearch
              optionFilterProp="children"
            >
              <Option value="AVOCarbon Kunshan">AVOCarbon Kunshan</Option>
              <Option value="AVOCarbon Tianjin">AVOCarbon Tianjin</Option>
              <Option value="AVOCarbon France">AVOCarbon France</Option>
              <Option value="Cyclam">Cyclam</Option>
              <Option value="AVOCarbon Germany">AVOCarbon Germany</Option>
              <Option value="AVOCarbon India">AVOCarbon India</Option>
              <Option value="AVOCarbon Korea">AVOCarbon Korea</Option>
              <Option value="AVOCarbon Tunisia">AVOCarbon Tunisia</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Remember me
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              block
            >
              Sign In
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
