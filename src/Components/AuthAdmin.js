import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Pagination, Tag } from "antd";
import Swal from "sweetalert2";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const AuthAdmin = () => {
  const [authRequests, setAuthRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const requestsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:3000/authorization-requests?page=${currentPage}&limit=${requestsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token invalid or expired");
          }
          return response.json();
        })
        .then((data) => setAuthRequests(data))
        .catch((error) =>
          console.error("Error fetching authorization requests:", error)
        );
    };

    fetchRequests(); // Initial fetch
    const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentPage]);

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: `Are you sure you want to ${newStatus.toLowerCase()} this request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token"); // Get the token from local storage

        // Optimistically update the UI
        const updatedRequests = authRequests.map((request) =>
          request.requestid === id ? { ...request, status: newStatus } : request
        );
        setAuthRequests(updatedRequests);

        // Make the server request
        axios
          .patch(
            `http://localhost:3000/authorization-requests/${id}`,
            {
              status: newStatus,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include the token in headers
              },
            }
          )
          .then((response) => {
            const confirmedRequests = authRequests.map((request) =>
              request.requestid === id ? response.data : request
            );
            setAuthRequests(confirmedRequests);
            Swal.fire(
              "Success!",
              `Request has been ${newStatus.toLowerCase()}.`,
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating authorization request:", error);
            // Revert the optimistic update if there was an error
            setAuthRequests(authRequests);
            Swal.fire(
              "Error!",
              "There was an error updating the request.",
              "error"
            );
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/authorization-requests/${id}`)
          .then(() => {
            setAuthRequests(
              authRequests.filter((request) => request.requestid !== id)
            );
            Swal.fire("Deleted!", "Request has been deleted.", "success");
          })
          .catch((error) =>
            console.error("Error deleting authorization request:", error)
          );
      }
    });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Purpose of Authorization",
      dataIndex: "purposeofauthorization",
      key: "purposeofauthorization",
    },
    {
      title: "Authorization Date",
      dataIndex: "authorizationdate",
      key: "authorizationdate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          color={
            text === "Approved"
              ? "green"
              : text === "Rejected"
              ? "red"
              : "yellow"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-3">
          <Button
            type="default"
            onClick={() => handleStatusChange(record.requestid, "Approved")}
            disabled={record.status === "Approved"}
            icon={<CheckOutlined />}
            style={{ backgroundColor: "#52c41a", color: "white" }}
          />
          <Button
            type="default"
            onClick={() => handleStatusChange(record.requestid, "Rejected")}
            disabled={record.status === "Rejected"}
            icon={<CloseOutlined />}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
          />
          <Button
            type="default"
            danger
            onClick={() => handleDelete(record.requestid)}
            icon={<DeleteOutlined />}
          />
          <Button
            type="default"
            onClick={() => setSelectedRequest(record)}
            icon={<EyeOutlined />}
          />
        </div>
      ),
    },
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={authRequests}
        rowKey="requestid"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={totalRequests}
        pageSize={requestsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ marginTop: 16, textAlign: "center" }}
      />
      <Modal
        title="Request Details"
        visible={!!selectedRequest}
        onCancel={() => setSelectedRequest(null)}
        footer={null}
      >
        {selectedRequest && (
          <div>
            <p>
              <strong>First Name:</strong> {selectedRequest.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedRequest.lastname}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRequest.phone}
            </p>
            <p>
              <strong>Department:</strong> {selectedRequest.department}
            </p>
            <p>
              <strong>Function:</strong> {selectedRequest.function}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Purpose of Authorization:</strong>{" "}
              {selectedRequest.purposeofauthorization}
            </p>
            {/* Include any other fields you want to show */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuthAdmin;
