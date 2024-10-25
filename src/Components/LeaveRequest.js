import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Input, Select, DatePicker, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const LeaveRequest = ({ employeeId }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleFinish = async (values) => {
  setSubmitting(true);

  const newLeaveRequest = new FormData();
  // Convert moment objects (startDate, endDate) to 'YYYY-MM-DD' format
  const formattedValues = {
    ...values,
    startDate: values.startDate.format("YYYY-MM-DD"),
    endDate: values.endDate.format("YYYY-MM-DD"),
  };
  Object.keys(formattedValues).forEach((key) => {
    newLeaveRequest.append(key, formattedValues[key]);
  });

  // Append the justification file if it exists
  if (fileList.length > 0) {
    newLeaveRequest.append("justificationFile", fileList[0].originFileObj); // Get the file object
  }

  // Add requestDate to FormData in 'YYYY-MM-DD' format
  newLeaveRequest.append("requestDate", moment().format("DD-MM-YYYY"));

  try {
    await axios.post(
      "https://bhr-avocarbon.azurewebsites.net/leave-requests",
      newLeaveRequest,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    Swal.fire({
      title: "Success!",
      text: "Leave request submitted successfully!",
      icon: "success",
    });

    form.resetFields();
    setFileList([]); // Clear the file list after submission
  } catch (error) {
    console.error("Error response:", error.response);
    setError(
      error.response ? error.response.data.error : "Something went wrong!"
    );
    Swal.fire({
      title: "Error!",
      text: "Failed to submit leave request",
      icon: "error",
    });
  } finally {
    setSubmitting(false);
  }
};


  const handleFileChange = ({ file, fileList }) => {
    setFileList(fileList); // Update state with file list
    if (file.status === "done") {
      Swal.fire({
        title: "Success!",
        text: `${file.name} file uploaded successfully`,
        icon: "success",
      });
    } else if (file.status === "error") {
      Swal.fire({
        title: "Error!",
        text: `${file.name} file upload failed.`,
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ requestDate: moment().format("DD-MM-YYYY") }}
      >
        <Form.Item
          name="employeeId"
          label="Serial Number (Employee ID, ID Number, M.At)"
          rules={[{ required: true, message: "Please enter your  ID" }]}
        >
          <Input placeholder="Enter your  ID" />
        </Form.Item>

        <Form.Item
          name="leaveType"
          label="Type of Leave"
          rules={[{ required: true, message: "Please select leave type" }]}
        >
          <Select placeholder="Select a leave type">
            <Option value="half_day">Half Day</Option>
            <Option value="Wedding">Wedding</Option>
            <Option value="Business">Business</Option>
            <Option value="Injury">Injury</Option>
            <Option value="Sick">Sick</Option>
            <Option value="Maternity">Maternity</Option>
            <Option value="Funeral">Funeral (Ghrama) / Explet</Option>
            <Option value="Annual Leave">Annual Leave</Option>
            <Option value="Compensatory">Compensatory</Option>
            <Option value="Without Pay">Without Pay</Option>
            <Option value="Seniority">Seniority</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="otherLeaveType"
          label="Please specify the type of leave"
          hidden={form.getFieldValue("leaveType") !== "Other"}
          rules={[
            {
              required: form.getFieldValue("leaveType") === "Other",
              message: "Please specify the type of leave",
            },
          ]}
        >
          <Input placeholder="Specify the type of leave" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date of Leave"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date of Leave"
          rules={[{ required: true, message: "Please select end date" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current < form.getFieldValue("startDate")
            }
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone (Personal Number)"
          rules={[
            { required: true, message: "Please enter your phone number" },
          ]}
        >
          <Input type="tel" placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item
          name="justification"
          label="Justification"
          rules={[{ required: true, message: "Please enter justification" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter justification" />
        </Form.Item>

        <Form.Item name="justificationFile" label="Upload Justification File">
          <Upload
            accept=".pdf,.doc,.docx,.jpg,.png"
            fileList={fileList} // Bind file list to state
            showUploadList={true}
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitting ? "Submitting..." : "Apply"}
          </Button>
        </Form.Item>

        {/* Error message */}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </Form>
    </div>
  );
};

export default LeaveRequest;
