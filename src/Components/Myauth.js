import React, { useState, useEffect } from "react";
import { Table, Spin, message, Tag, Button, Modal } from "antd";
import Topbar from "./TopBar";
import Sidebar from "./SideBar";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const MyAuth = () => {
  const { t } = useTranslation();
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
          throw new Error(t("fetchError"));
        }
        const data = await response.json();
        setAuthorizationRequests(data);
        setError(null);
      } catch (error) {
        console.error(t("fetchError"), error);
        setError(error.message || t("fetchError"));
        message.error(error.message || t("fetchError"));
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
      message.success(t("deleteSuccess"));
      setAuthorizationRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== deleteId)
      );
      setIsModalVisible(false);
      setDeleteId(null);
    } catch (error) {
      message.error(t("deleteError"));
      console.error(t("deleteError"), error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };

  const columns = [
    {
      title: t("authRequest.myAuth.Purpose"),
      dataIndex: "purpose_of_authorization",
      key: "purpose_of_authorization",
      responsive: ["md"],
    },
    {
      title: t("authRequest.myAuth.Date"),
      dataIndex: "authorization_date",
      key: "authorization_date",
      render: (text) => formatDate(text),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("authRequest.myAuth.DepartureTime"),
      dataIndex: "departure_time",
      key: "departure_time",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("authRequest.myAuth.ReturnTime"),
      dataIndex: "return_time",
      key: "return_time",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("authRequest.myAuth.Status"),
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === t("Pending")
              ? "gold"
              : status === t("Approved")
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
      title: t("authRequest.myAuth.Action"),
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
                title={t("deleteConfirmation")}
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText={t("authRequest.myAuth.yesDelete")}
                cancelText={t("authRequest.myAuth.cancel")}
              >
                <p>{t("authRequest.myAuth.deleteConfirmationMessage")}</p>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAuth;
