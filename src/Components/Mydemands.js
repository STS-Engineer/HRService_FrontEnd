import React, { useState, useEffect } from "react";
import { Table, Button, message, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const DemandsPage = ({ user }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [authorizationRequests, setAuthorizationRequests] = useState([]);
  const [missionRequests, setMissionRequests] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("leave"); // Default filter

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await Promise.all([
          fetch(`http://localhost:3000/leave-requests/employee/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `http://localhost:3000/authorization-requests/employee/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(`http://localhost:3000/mission-requests/employee/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:3000/document-requests/employee/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [leaveData, authorizationData, missionData, documentData] =
          await Promise.all(response.map((res) => res.json()));

        setLeaveRequests(leaveData);
        setAuthorizationRequests(authorizationData);
        setMissionRequests(missionData);
        setDocumentRequests(documentData);
        setError(null);
      } catch (error) {
        setError(error.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/leave-requests/${requestId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Request deleted successfully.");
        // Refetch requests or update state accordingly
      } catch (error) {
        message.error("Failed to delete request.");
      }
    }
  };
  const renderTable = () => {
    const columns = [
      {
        title: "Leave Type",
        dataIndex: "leave_type",
        key: "leave_type",
      },
      {
        title: "Dates",
        dataIndex: "dates",
        key: "dates",
        render: (_, record) =>
          `from ${new Date(
            record.start_date
          ).toLocaleDateString()} to ${new Date(
            record.end_date
          ).toLocaleDateString()}`,
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
        render: (status) => {
          let color;
          if (status === "Approved") color = "green";
          else if (status === "Rejected") color = "red";
          else color = "yellow"; // For other statuses like "Pending"
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <div>
            <Button
              type="default"
              danger
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
            />
          </div>
        ),
      },
    ];

    const dataSource =
      selectedFilter === "leave"
        ? leaveRequests
        : selectedFilter === "authorization"
        ? authorizationRequests
        : selectedFilter === "mission"
        ? missionRequests
        : documentRequests;

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
      />
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">My Requests</h1>
      <div className="flex space-x-4 mb-4">
        {["leave", "authorization", "mission", "document"].map((filter) => (
          <Button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={
              selectedFilter === filter
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }
          >
            {`${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
          </Button>
        ))}
      </div>
      {renderTable()}
    </div>
  );
};

export default DemandsPage;
