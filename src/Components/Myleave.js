import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Tag } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import "antd/dist/reset.css";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import DynamicHeader from "./DynamicHeader";

const MyLeave = () => {
  const { t } = useTranslation();
  const location = useLocation();
  console.log("Current Path:", location.pathname);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `https://bhr-avocarbon.azurewebsites.net/leave-requests/employee/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeaveRequests(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError(
          error.response?.data?.message || "Failed to fetch leave requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
  };

  const showDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://bhr-avocarbon.azurewebsites.net/leave-requests/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Leave request deleted successfully.");
      setLeaveRequests(
        leaveRequests.filter((request) => request.id !== deleteId)
      );
      setIsModalVisible(false);
      setDeleteId(null);
    } catch (error) {
      message.error("Failed to delete leave request.");
      console.error("Error deleting leave request:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };

  const columns = [
    {
      title: t("leaveRequest.leaveTypeLabel"),
      dataIndex: "leave_type",
      key: "leave_type",
      responsive: ["md"],
    },
    {
      title: t("leaveRequest.dates"),
      key: "dates",
      render: (text, record) => (
        <span>
          from {formatDate(record.start_date)} to {formatDate(record.end_date)}
        </span>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("leaveRequest.justificationLabel"),
      dataIndex: "justification",
      key: "justification",
      responsive: ["md"],
    },
    {
      title: t("missionRequest.myMission.status"),
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Pending"
              ? "gold"
              : status === "Approved"
              ? "green"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("dashboard.action"),
      key: "action",
      render: (text, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.id)}
        />
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <DynamicHeader currentPath={location.pathname} />
        <div className="p-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                {" "}
                {/* Enables horizontal scroll for smaller screens */}
                <Table
                  columns={columns}
                  dataSource={leaveRequests}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  bordered
                />
              </div>
              <Modal
                title="Delete Confirmation"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Yes, Delete"
                cancelText="Cancel"
              >
                <p>Are you sure you want to delete this leave request?</p>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLeave;
