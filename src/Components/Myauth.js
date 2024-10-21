import React, { useState, useEffect } from "react";
import { Table, Spin, message, Tag, Button, Modal } from "antd";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";

const MyAuth = () => {
  const [authorizationRequests, setAuthorizationRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchAuthorizationRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(
          `http://localhost:3000/authorization-requests/employee/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch authorization requests");
        }
        const data = await response.json();
        setAuthorizationRequests(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching authorization requests:", error);
        setError(error.message || "Failed to fetch authorization requests");
        message.error(
          error.message || "Failed to fetch authorization requests"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorizationRequests();
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
      await fetch(`http://localhost:3000/authorization-requests/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Authorization request deleted successfully.");
      setAuthorizationRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== deleteId)
      );
      setIsModalVisible(false);
      setDeleteId(null);
    } catch (error) {
      message.error("Failed to delete authorization request.");
      console.error("Error deleting authorization request:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };

  const columns = [
    {
      title: "Purpose",
      dataIndex: "purpose_of_authorization",
      key: "purpose_of_authorization",
    },
    {
      title: "Date",
      dataIndex: "authorization_date",
      key: "authorization_date",
      render: (text) => formatDate(text),
    },
    {
      title: "Departure Time",
      dataIndex: "departure_time",
      key: "departure_time",
    },
    {
      title: "Return Time",
      dataIndex: "return_time",
      key: "return_time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "Pending"
              ? "bg-yellow-400 text-white"
              : status === "Approved"
              ? "bg-green-400 text-white"
              : "bg-red-400 text-white"
          }`}
        >
          {status}
        </Tag>
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
      <div className="flex-1 overflow-y-auto">
        <Topbar />
        <div className="p-4">
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={authorizationRequests}
                rowKey="id"
                pagination={{ pageSize: 5 }}
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
                <p>
                  Are you sure you want to delete this authorization request?
                </p>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAuth;
