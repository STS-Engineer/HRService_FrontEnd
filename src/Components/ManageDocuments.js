import React, { useState } from "react";
import { Upload, Button, message, Row, Col, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SidebarAdmin from "./SideBarAdmin";
import TopBarAdmin from "./TopBarAdmin";

const DocumentManagement = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    setSelectedFiles(info.fileList);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const certificateUrl = e.target.result;
          const employeeName = file.name.split(".")[0]; // Assuming the file name is employeeName.pdf
          addSalaryCertificate({ employeeName, certificateUrl });
        };
        reader.readAsDataURL(file.originFileObj);
      });
      message.success("Salary certificates uploaded successfully.");
      setSelectedFiles([]);
    } else {
      message.warning("Please select files.");
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBarAdmin />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              title="Upload Salary Certificates"
              bordered={false}
              className="p-4"
            >
              <Row gutter={16}>
                <Col span={24} sm={12}>
                  <Upload
                    multiple
                    beforeUpload={() => false} // Prevent auto upload
                    onChange={handleFileChange}
                    fileList={selectedFiles}
                    showUploadList={{ showRemoveIcon: true }}
                    accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                  >
                    <Button icon={<UploadOutlined />}>Select Files</Button>
                  </Upload>
                </Col>
                <Col
                  span={24}
                  sm={12}
                  className="flex justify-center items-center"
                >
                  <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                  >
                    Upload
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
