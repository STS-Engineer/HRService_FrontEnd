import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Tag } from "antd";
import axios from "axios";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import "antd/dist/reset.css"; // Ensure you are using the correct CSS for Ant Design
import { useTranslation } from "react-i18next";
import { DeleteOutlined } from "@ant-design/icons";

const MyMission = () => {
  const { t } = useTranslation();
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
        setError(t("myMission.error"));
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
      message.success(t("missionRequest.myMission.deleteSuccess"));
      setMissionRequests(
        missionRequests.filter((request) => request.id !== deleteId)
      );
      setIsModalVisible(false);
      setDeleteId(null);
    } catch (error) {
      message.error(t("missionRequest.myMission.deleteError"));
      console.error("Error deleting mission request:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };

  const columns = [
    {
      title: t("missionRequest.myMission.purposeOfTravel"),
      dataIndex: "purpose_of_travel",
      key: "purpose_of_travel",
      responsive: ["md"],
    },
    {
      title: t("missionRequest.myMission.duration"),
      key: "duration",
      render: (text, record) => (
        <span>
          {t("missionRequest.myMission.from")} {formatDate(record.start_date)}{" "}
          {t("missionRequest.myMission.to")} {formatDate(record.end_date)}
        </span>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("missionRequest.myMission.destination"),
      dataIndex: "destination",
      key: "destination",
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
      title: t("missionRequest.myMission.action"),
      key: "action",
      render: (text, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record.id)}
        />
      ),
      responsive: ["xs", "sm", "md", "lg"], // Show on all screen sizes
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-4">
          {loading ? (
            <p>{t("missionRequest.myMission.loading")}</p>
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
                title={t("missionRequest.myMission.deleteConfirmation.title")}
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText={t("missionRequest.myMission.deleteConfirmation.okText")}
                cancelText={t(
                  "missionRequest.myMission.deleteConfirmation.cancelText"
                )}
              >
                <p>
                  {t("missionRequest.myMission.deleteConfirmation.message")}
                </p>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMission;
