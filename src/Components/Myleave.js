import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import "antd/dist/reset.css";

const MyLeave = () => {
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
      title: "Leave Type",
      dataIndex: "leave_type",
      key: "leave_type",
    },
    {
      title: "Dates",
      key: "dates",
      render: (text, record) => (
        <span>
          from {formatDate(record.start_date)} to {formatDate(record.end_date)}
        </span>
      ),
    },
    {
      title: "Justification",
      dataIndex: "justification",
      key: "justification",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "Pending"
              ? "bg-yellow-400 text-white"
              : status === "Approved"
              ? "bg-green-400 text-white"
              : "bg-red-400 text-white"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button danger onClick={() => showDeleteConfirm(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={leaveRequests}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                bordered
              />
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
