import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Menu, Badge } from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import i18n from "../i18n";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", country: "GB" },
  { code: "fr", name: "Français", country: "FR" },
  { code: "zh", name: "中文", country: "CN" },
  { code: "es", name: "Español", country: "MX" },
  { code: "de", name: "Deutsch", country: "DE" },
  { code: "hi", name: "हिन्दी", country: "IN" },
  { code: "tr", name: "Türkçe", country: "TR" },
];

const TopBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    profilePhoto: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `https://bhr-avocarbon.azurewebsites.net/auth/user/${userId}/photo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const photoUrl = URL.createObjectURL(blob);
          setProfilePhoto(photoUrl);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };

    fetchProfilePhoto();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `https://bhr-avocarbon.azurewebsites.net/auth/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUser({
          firstname: data.firstname,
          lastname: data.lastname,
          profilePhoto: data.profilePhoto,
          role: data.role,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/profile")}>
        <UserOutlined className="mr-2" />
        {t("profile")}
      </Menu.Item>
      <Menu.Item key="2" onClick={handleChangePassword}>
        <LockOutlined className="mr-2" />
        {t("changePassword")}
      </Menu.Item>
      <Menu.Item key="3" onClick={handleLogout}>
        <LogoutOutlined className="mr-2" />
        {t("logout")}
      </Menu.Item>
    </Menu>
  );

  const languageMenu = (
    <Menu>
      {languages.map((lang) => (
        <Menu.Item key={lang.code} onClick={() => changeLanguage(lang.code)}>
          <Flag
            code={lang.country}
            style={{ width: 20, height: 14, marginRight: 10 }}
          />
          {lang.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const containerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    background: "linear-gradient(90deg, #076eaf, #3b82f6)", // Gradient background for modern look
    height: "64px",
    color: "white",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Adding a subtle shadow for modern appeal
  };

  const rightContainerStyles = {
    display: "flex",
    alignItems: "center",
    gap: "20px", // Increased gap for spacing
  };

  const profileStyles = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  };

  const usernameStyles = {
    marginLeft: "10px",
    color: "white",
    fontSize: "16px",
    fontWeight: "500", // Slightly bolder text for modern look
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={containerStyles}>
      <div></div>
      <div style={rightContainerStyles}>
        <Dropdown overlay={languageMenu} trigger={["click"]}>
          <GlobalOutlined
            style={{
              fontSize: 22,
              cursor: "pointer",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fbbf24")}
            onMouseLeave={(e) => (e.target.style.color = "#fff")}
          />
        </Dropdown>
        <Dropdown overlay={profileMenu} trigger={["click"]}>
          <div
            style={profileStyles}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <Avatar
              size="large"
              src={profilePhoto || <UserOutlined />}
              alt={`${user.firstname} ${user.lastname}`}
              icon={!profilePhoto && <UserOutlined />}
            />
            <span style={usernameStyles}>
              {`${user.firstname} ${user.lastname}`}
            </span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopBar;
