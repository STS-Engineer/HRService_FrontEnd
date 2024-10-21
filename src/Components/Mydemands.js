import React, { useState, useEffect } from "react";
import { Table, Button, message, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { FaDownload } from "react-icons/fa";

const DemandsPage = ({ user }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [authorizationRequests, setAuthorizationRequests] = useState([]);
  const [missionRequests, setMissionRequests] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("leave");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("Token retrieved:", token);
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await Promise.all([
          fetch(`https://bhr-avocarbon.azurewebsites.net/leave-requests/employee/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `https://bhr-avocarbon.azurewebsites.net/authorization-requests/employee/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(`https://bhr-avocarbon.azurewebsites.net/mission-requests/employee/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [leaveData, authorizationData, missionData, documentData] =
          await Promise.all(response.map((res) => res.json()));

        setLeaveRequests(leaveData);
        setAuthorizationRequests(authorizationData);
        setMissionRequests(missionData);

        setError(null);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError(error.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId, requestType) => {
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
        let url;

        // Determine the correct URL based on the request type
        switch (requestType) {
          case "Leave":
            url = `https://bhr-avocarbon.azurewebsites.net/leave-requests/${requestId}`;
            break;
          case "Mission":
            url = `https://bhr-avocarbon.azurewebsites.net/mission-requests/${requestId}`;
            break;
          case "Authorization":
            url = `https://bhr-avocarbon.azurewebsites.net/authorization-requests/${requestId}`;
            break;
          default:
            throw new Error("Unknown request type");
        }

        // Make the DELETE request
        await fetch(url, {
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
    const columns = {
      leave: [
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
              from {new Date(record.start_date).toLocaleDateString()} to{" "}
              {new Date(record.end_date).toLocaleDateString()}
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
            <Tag
              color={
                status === "Approved"
                  ? "green"
                  : status === "Rejected"
                  ? "red"
                  : "yellow"
              }
            >
              {status}
            </Tag>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <Button
              danger
              onClick={() => handleDelete(record.id, "Leave")}
              icon={<DeleteOutlined />}
            />
          ),
        },
      ],
      authorization: [
        {
          title: "Purpose",
          dataIndex: "purpose_of_authorization",
          key: "purpose_of_authorization",
        },
        {
          title: "Date",
          dataIndex: "authorization_date",
          key: "authorization_date",
          render: (text) => new Date(text).toLocaleDateString(),
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
              color={
                status === "Pending"
                  ? "yellow"
                  : status === "Approved"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </Tag>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <Button
              danger
              onClick={() => handleDelete(record.id, "Authorization")}
              icon={<DeleteOutlined />}
            />
          ),
        },
      ],
      mission: [
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
              from {new Date(record.start_date).toLocaleDateString()} to{" "}
              {new Date(record.end_date).toLocaleDateString()}
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
            <Tag
              color={
                status === "Pending"
                  ? "yellow"
                  : status === "Approved"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </Tag>
          ),
        },
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <Button
              danger
              onClick={() => handleDelete(record.id, "Mission")}
              icon={<DeleteOutlined />}
            />
          ),
        },
      ],
      document: [
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
        {
          title: "Action",
          key: "action",
          render: (text, record) => (
            <Button
              danger
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
            />
          ),
        },
      ],
    };

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
        columns={columns[selectedFilter]}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
      />
    );
  };

  return (
    <div>
      {/* <h1 className="text-2xl font-bold">My Requests</h1> */}
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
