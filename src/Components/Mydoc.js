import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Spin, Alert, message, Modal } from "antd";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import "antd/dist/reset.css"; // Ant Design styles
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const MyDoc = ({ user }) => {
  const { t } = useTranslation();
  const [documentRequests, setDocumentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const handleGetAllDocumentRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(
          `http://localhost:3000/document-requests/employee/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(t("error.fetchFailed"));
        }
        const data = await response.json();
        setDocumentRequests(data);
        setError(null);
      } catch (error) {
        setError(t("error.fetchFailed"));
        Swal.fire(t("error.title"), t("error.fetchFailed"), "error");
      } finally {
        setLoading(false);
      }
    };
    handleGetAllDocumentRequests();
  }, [t]);
  const showDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/document-requests/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Document request deleted successfully.");
      setDocumentRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== deleteId)
      );
      setIsModalVisible(false);
      setDeleteId(null);
    } catch (error) {
      message.error(t("error.deleteFailed"));
      console.error("Error deleting document request:", error);
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };
  const columns = [
    {
      title: t("documentRequest.table.documentType"),
      dataIndex: "document_type",
      key: "document_type",
      render: (text) => text || t("table.na"),
      responsive: ["md"],
    },
    {
      title: t("documentRequest.table.download"),
      key: "download",
      render: (doc) =>
        doc.file_path ? (
          <Button
            type="primary"
            icon={<FaDownload />}
            onClick={() => {
              window.location.href = `http://localhost:3000/document-requests/download/${doc.file_path}`;
            }}
          >
            Download
          </Button>
        ) : (
          <span>No file available</span>
        ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: t("documentRequest.table.statuskey"),
      dataIndex: "status",
      key: "documentRequest.status",
      render: (status) => (
        <Tag
          color={
            status === "Pending"
              ? "gold"
              : status === "Completed"
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
      title: t("documentRequest.table.action"),
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
    <div className="p4">
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={documentRequests}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
          />
          <Modal
            title={t("modal.title")}
            visible={isModalVisible}
            onOk={handleDelete}
            onCancel={handleCancel}
            okText={t("modal.confirm")}
            cancelText={t("modal.cancel")}
          >
            <p>{t("modal.body")}</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default MyDoc;
