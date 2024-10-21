import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Tag } from "antd";
import { AiOutlineDownload, AiOutlineEye } from "react-icons/ai";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";

// Initialize SweetAlert
const MySwal = withReactContent(Swal);

const DashboardAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5);

  useEffect(() => {
    const fetchRequests = () => {
      const token = localStorage.getItem("token");
      fetch(
        `https://bhr-avocarbon.azurewebsites.net/leave-requests?page=${currentPage}&limit=${requestsPerPage}`,
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
        .then((data) => setLeaveRequests(data))
        .catch((error) =>
          console.error("Error fetching leave requests:", error)
        );
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);

    return () => clearInterval(interval);
  }, [currentPage]);

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
        fetch(`https://bhr-avocarbon.azurewebsites.net/leave-requests/${id}`, {
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
            const updatedRequests = leaveRequests.map((request) =>
              request.requestid === id
                ? { ...request, status: newStatus }
                : request
            );
            setLeaveRequests(updatedRequests);
            MySwal.fire(
              "Success!",
              `Request has been ${newStatus.toLowerCase()}ed.`,
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating leave request:", error);
            MySwal.fire("Error!", "Failed to update request.", "error");
          });
      }
    });
  };

  // Handle delete with SweetAlert confirmation
  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        fetch(`https://bhr-avocarbon.azurewebsites.net/leave-requests/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            setLeaveRequests(
              leaveRequests.filter((request) => request.requestid !== id)
            );
            MySwal.fire(
              "Deleted !",
              "The request has been deleted.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error deleting leave request:", error);
            MySwal.fire("Error!", "Failed to delete the request.", "error");
          });
      }
    });
  };

  // Handle file download
  const handleFileDownload = (fileUrl, fileName) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        message.error("Failed to download file");
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
      title: "LeaveType",
      dataIndex: "leavetype",
      key: "leavetype",
    },
    {
      title: "Date Range",
      dataIndex: "dateRange",
      key: "dateRange",
      render: (text, record) =>
        `${moment(record.startdate)
          .startOf("day")
          .format("DD-MM-YYYY")} to ${moment(record.enddate)
          .startOf("day")
          .format("DD-MM-YYYY")}`,
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
      title: "Justification File",
      key: "actions",
      render: (text, record) => (
        <div>
          {record.justificationfile && (
            <div>
              <Button
                icon={<AiOutlineEye />}
                onClick={() =>
                  Modal.info({
                    title: "Justification File",
                    content: (
                      <div>
                        <iframe
                          src={`https://bhr-avocarbon.azurewebsites.net/uploads/${record.justificationfile}`}
                          style={{
                            width: "100%",
                            height: "500px",
                            border: "none",
                          }}
                          title="Justification File"
                        />
                        <div className="mt-2 flex items-center">
                          <Button
                            icon={<AiOutlineDownload />}
                            onClick={() => (
                              handleFileDownload(
                                `https://bhr-avocarbon.azurewebsites.net/uploads/${record.justificationfile}',
                                record.justificationfile
                              )
                            )}
                            className="mr-2"
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    ),
                    onOk() {},
                  })
                }
              >
                View File
              </Button>
            </div>
          )}
        </div>
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
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div className="p-4">
      <Table
        dataSource={leaveRequests}
        columns={columns}
        rowKey="requestid"
        pagination={{
          current: currentPage,
          pageSize: requestsPerPage,
          total: leaveRequests.length,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default DashboardAdmin;
