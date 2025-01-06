import React, { useState } from "react";
import {
  InboxOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { message, Upload, Button, Row, Col, Typography, Progress } from "antd";
import axios from "axios";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const SalaryCertificateUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("certificates", file); // File from Ant Design's Dragger
    });

    setUploading(true);
    setUploadProgress(0); // Reset progress

    try {
      const response = await axios.post(
        "http://localhost:3000/salary-certificates",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      message.success("Upload successful");
      setFileList([]); // Clear the file list after successful upload
    } catch (error) {
      message.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0); // Reset progress bar
    }
  };

  const draggerProps = {
    multiple: true,
    fileList,
    onRemove: (file) => {
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== file.uid)
      );
    },
    beforeUpload: (file) => {
      setFileList((prevList) => [...prevList, file]);
      return false; // Prevent auto upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "80vh", padding: "20px" }}
      gutter={[16, 16]} // Add gutter to create space between columns
    >
      {/* Left Side: Undraw Icon */}
      <Col xs={16} sm={12} style={{ textAlign: "center" }}>
        <img
          src="undraw_transfer_files_re_a2a9.svg"
          alt="Upload Illustration"
          style={{ maxWidth: "100%", marginBottom: "20px" }}
        />
      </Col>

      {/* Right Side: Upload Area */}
      <Col xs={24} sm={12}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title level={2} style={{ color: "#3b5998" }}>
            Upload Salary Certificates
          </Title>
          <Text type="secondary" style={{ fontSize: "16px", color: "#606770" }}>
            Please upload the salary certificates in PDF format. You can upload
            multiple files.
          </Text>
          <br />
          <Text strong>
            NB: The format of the salary certificate file should be
            <Text style={{ color: "red", fontWeight: "bold" }}>
              {" "}
              MAT-EmployeeId
            </Text>
            (e.g., <Text style={{ color: "red" }}>MAT-123.pdf</Text>).
          </Text>
        </div>

        <Dragger
          {...draggerProps}
          style={{
            backgroundColor: "#f4f7f9",
            padding: "20px",
            border: "2px dashed #1890ff",
            borderRadius: "8px",
          }}
          accept="application/pdf" // Only allow PDF files
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: "#1890ff", fontSize: "48px" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: "16px", color: "#1890ff" }}
          >
            Click or drag file to this area to upload
          </p>
          <p
            className="ant-upload-hint"
            style={{ fontSize: "14px", color: "#606770" }}
          >
            Support for bulk upload. Only PDF files are allowed for salary
            certificates.
          </p>
        </Dragger>

        {/* Progress Bar */}
        {uploading && (
          <Progress
            percent={uploadProgress}
            status={uploadProgress === 100 ? "success" : "active"}
            style={{ marginTop: "20px" }}
          />
        )}

        {/* Icons for Upload, Cancel */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            icon={<UploadOutlined />}
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            size="large"
            style={{
              marginRight: "10px",
              backgroundColor: "#28a745",
              borderColor: "#28a745",
              color: "#fff",
            }}
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>

          <Button
            icon={<CloseCircleOutlined />}
            size="large"
            style={{
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
              color: "#fff",
            }}
            onClick={() => {
              setFileList([]); // Clear the file list
              setUploadProgress(0); // Reset progress bar
              message.warning("Upload canceled.");
            }}
          >
            Cancel
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default SalaryCertificateUpload;
