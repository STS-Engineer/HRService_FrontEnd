import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import "antd/dist/reset.css"; // Ensure you are using the correct CSS for Ant Design

const MyMission = () => {
  const [missionRequests, setMissionRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchMissionRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        // Fetch mission requests for the logged-in employee
        const response = await axios.get(
          `http://localhost:3000/mission-requests/employee/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMissionRequests(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching mission requests:", error);
        setError(
          error.response?.data?.message || "Failed to fetch mission requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissionRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
  };

  const showDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/mission-requests/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Mission request deleted successfully.");
      setMissionRequests(
        missionRequests.filter((request) => request.id !== deleteId)
      );
      setIsModalVisible(false);
      setDeleteId(null);
    } catch (error) {
      message.error("Failed to delete mission request.");
      console.error("Error deleting mission request:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };

  const columns = [
    {
      title: "Purpose Of Travel",
      dataIndex: "purpose_of_travel",
      key: "purpose_of_travel",
    },
    {
      title: "Duration",
      key: "duration",
      render: (text, record) => (
        <span>
          from {formatDate(record.start_date)} to {formatDate(record.end_date)}
        </span>
      ),
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
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
                dataSource={missionRequests}
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
                <p>Are you sure you want to delete this mission request?</p>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMission;
