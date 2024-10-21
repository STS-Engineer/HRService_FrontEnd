import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import Swal from "sweetalert2";

const { Option } = Select;

const DocumentRequest = () => {
  const [form] = Form.useForm(); // Ant Design form instance
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (values) => {
    setSubmitting(true);

    const newDocumentRequest = {
      employee_id: values.employeeId,
      document_type:
        values.documentType === "other"
          ? values.otherDocumentType
          : values.documentType,
      additional_info: values.documentPurpose,
    };

    // Get the token from local storage (or wherever it's stored)
    const token = localStorage.getItem("token"); // Adjust this based on your app's implementation

    try {
      await axios.post(
        "http://localhost:3000/document-requests",
        newDocumentRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      // Success alert using SweetAlert
      Swal.fire({
        icon: "success",
        title: "Document request submitted successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      form.resetFields(); // Reset the form after successful submission
    } catch (err) {
      // Error alert using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to submit document request. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {/* Employee ID */}
        <Form.Item
          label="Serial Number (Employee ID, ID Number, M.At)"
          name="employeeId"
          rules={[
            { required: true, message: "Please input your employee ID!" },
          ]}
        >
          <Input placeholder="Enter your  ID" />
        </Form.Item>

        {/* Document Type */}
        <Form.Item
          label="Type of Document"
          name="documentType"
          rules={[
            { required: true, message: "Please select a document type!" },
          ]}
        >
          <Select placeholder="Select Document Type">
            <Option value="salary-certificate">Salary Certificate</Option>
            <Option value="work-certificate">Work Certificate</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        {/* Other Document Type (shown only if 'Other' is selected) */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.documentType !== currentValues.documentType
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("documentType") === "other" ? (
              <Form.Item
                label="Please Specify"
                name="otherDocumentType"
                rules={[
                  {
                    required: true,
                    message: "Please specify the document type!",
                  },
                ]}
              >
                <Input placeholder="Specify the document type" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {/* Document Purpose */}
        <Form.Item label="Document Purpose" name="documentPurpose">
          <Input placeholder="Enter the purpose of the document" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitting ? "Submitting..." : "Apply"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DocumentRequest;
