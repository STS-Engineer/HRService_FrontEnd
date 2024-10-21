import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Avatar, Dropdown, Menu, Badge } from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
} from "@ant-design/icons";
// Import custom styles

const { Header } = Layout;

const TopBar = () => {
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
  const [unreadNotifications, setUnreadNotifications] = useState(5); // Example count for unread notifications

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(localStorage.getItem("user")).id;
        const response = await fetch(
          `http://localhost:3000/auth/user/${userId}/photo`,
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
          `http://localhost:3000/auth/user/${userId}`,
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

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/profile")}>
        <UserOutlined />
        Profile
      </Menu.Item>
      <Menu.Item key="2" onClick={handleChangePassword}>
        <LockOutlined />
        Change Password
      </Menu.Item>
      <Menu.Item key="3" onClick={handleLogout}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Header className="topbar-header">
      <div className="topbar-left"></div>
      <div className="topbar-right">
        <Dropdown overlay={profileMenu} trigger={["click"]}>
          <div className="topbar-profile" style={{ cursor: "pointer" }}>
            <Avatar
              size="large"
              src={profilePhoto || <UserOutlined />}
              alt={`${user.firstname} ${user.lastname}`}
              icon={!profilePhoto && <UserOutlined />}
            />
            <span className="topbar-username">{`${user.firstname} ${user.lastname}`}</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default TopBar;
