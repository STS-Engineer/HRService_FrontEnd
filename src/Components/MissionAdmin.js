import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Pagination, Tag } from "antd";
import Swal from "sweetalert2";
import { EyeOutlined } from "@ant-design/icons";
import withReactContent from "sweetalert2-react-content";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
// Initialize SweetAlert
const MySwal = withReactContent(Swal);

const MissionAdmin = () => {
  const [missionRequests, setMissionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const requestsPerPage = 5;

  useEffect(() => {
    const fetchMissionRequests = () => {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:3000/mission-requests?page=${currentPage}&limit=${requestsPerPage}`,
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
        .then((data) => setMissionRequests(data))
        .catch((error) =>
          console.error("Error fetching mission requests:", error)
        );
    };

    fetchMissionRequests(); // Initial fetch
    const interval = setInterval(fetchMissionRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentPage, requestsPerPage]);

  // Handle status change with SweetAlert confirmation
  const handleStatusChange = (id, newStatus) => {
    MySwal.fire({
      title: `Are you sure you want to ${newStatus.toLowerCase()} this request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${newStatus.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3000/mission-requests/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((updatedRequest) => {
            const updatedRequests = missionRequests.map((request) =>
              request.requestid === id
                ? { ...request, status: newStatus }
                : request
            );
            setMissionRequests(updatedRequests);
            MySwal.fire(
              "Success!",
              `Request has been ${newStatus.toLowerCase()}ed.`,
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating mission request:", error);
            MySwal.fire("Error!", "Failed to update request.", "error");
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
        const token = localStorage.getItem("token");
        fetch(`http://localhost:3000/mission-requests/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            setMissionRequests(
              missionRequests.filter((request) => request.requestid !== id)
            );
            Swal.fire("Deleted!", "Request has been deleted.", "success");
          })
          .catch((error) =>
            console.error("Error deleting mission request:", error)
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
      title: "Purpose of Travel",
      dataIndex: "purposeoftravel",
      key: "purposeoftravel",
    },
    {
      title: "Dates",
      dataIndex: "startdate",
      key: "dates",
      render: (text, record) => (
        <span>
          {new Date(record.startdate).toLocaleDateString()} to{" "}
          {new Date(record.enddate).toLocaleDateString()}
        </span>
      ),
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
          ></Button>
          <Button
            type="default"
            onClick={() => handleStatusChange(record.requestid, "Rejected")}
            disabled={record.status === "Rejected"}
            icon={<CloseOutlined />}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
          ></Button>
          <Button
            type="default"
            danger
            onClick={() => handleDelete(record.requestid)}
            icon={<DeleteOutlined />}
          ></Button>
          <Button
            type="default"
            onClick={() => setSelectedRequest(record)}
            icon={<EyeOutlined />} // Add Eye icon for viewing details
          ></Button>
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
        dataSource={missionRequests}
        rowKey="requestid"
        pagination={false}
        onRow={(record) => ({
          // onClick: () => setSelectedRequest(record),
        })}
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
              <strong>Phone:</strong> {selectedRequest.phone}
            </p>
            <p>
              <strong>Destination:</strong> {selectedRequest.destination}
            </p>
            <p>
              <strong>Mission Budget:</strong> {selectedRequest.missionbudget}{" "}
              euro
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MissionAdmin;
