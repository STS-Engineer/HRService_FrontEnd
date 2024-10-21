import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Spin, Alert, message, Modal } from "antd";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import "antd/dist/reset.css"; // Ant Design styles

const MyDoc = ({ user }) => {
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
          `https://bhr-avocarbon.azurewebsites.net/document-requests/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch document requests");
        }
        const data = await response.json();
        setDocumentRequests(data);
        setError(null);
      } catch (error) {
        setError(error.message || "Failed to fetch document requests");
        Swal.fire("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    handleGetAllDocumentRequests();
  }, []);
  const showDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`https://bhr-avocarbon.azurewebsites.net/document-requests/${deleteId}`, {
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
      message.error("Failed to delete document request.");
      console.error("Error deleting document request:", error);
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteId(null);
  };
  const columns = [
    {
      title: "Document Type",
      dataIndex: "document_type",
      key: "document_type",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    },
    {
      title: "Download",
      key: "download",
      render: (doc) =>
        doc.file_path ? (
          <Button
            type="primary"
            icon={<FaDownload />}
            onClick={() => {
              window.location.href = `https://bhr-avocarbon.azurewebsites.net/document-requests/download/${doc.file_path}`;
            }}
          >
            Download
          </Button>
        ) : (
          <span>No file available</span>
        ),
    },
    ,
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
            title="Delete Confirmation"
            visible={isModalVisible}
            onOk={handleDelete}
            onCancel={handleCancel}
            okText="Yes, Delete"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete this documet request?</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default MyDoc;
