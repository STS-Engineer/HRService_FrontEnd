import React, { useState } from "react";
import { Form, Input, Button, DatePicker, TimePicker } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

const AuthRequest = () => {
  const [form] = Form.useForm(); // Get the form instance
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    const formData = {
      ...values,
      authorizationDate: values.authorizationDate
        ? values.authorizationDate.format("YYYY-MM-DD")
        : "",
      departureTime: values.departureTime
        ? values.departureTime.format("HH:mm")
        : "",
      returnTime: values.returnTime ? values.returnTime.format("HH:mm") : "",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
      await axios.post(
        "http://localhost:3000/authorization-requests",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubmitting(false);
      Swal.fire(
        "Success!",
        "Authorization request submitted successfully!",
        "success"
      );

      // Clear form fields after successful submission
      form.resetFields(); // Reset the form fields
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response ? error.response.data.error : "Something went wrong!",
        "error"
      );
      setSubmitting(false);
    }
  };

  const today = moment(); // Current date for min date

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Employee ID */}
        <Form.Item
          label="Serial Number (Employee ID, ID Number, M.At)"
          name="employeeId"
          rules={[
            { required: true, message: "Please input your Employee ID!" },
          ]}
        >
          <Input placeholder="Enter your ID" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Phone (Personal Number)"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        {/* Authorization Date */}
        <Form.Item
          label="Authorization Date"
          name="authorizationDate"
          rules={[{ required: true, message: "Please select a date!" }]}
        >
          <DatePicker
            style={{ width: "20%" }}
            disabledDate={(current) => current && current < today}
          />
        </Form.Item>

        {/* Departure and Return Time */}
        <Form.Item label="Departure Time" name="departureTime">
          <TimePicker style={{ width: "20%" }} format="HH:mm" />
        </Form.Item>

        <Form.Item label="Return Time" name="returnTime">
          <TimePicker style={{ width: "20%" }} format="HH:mm" />
        </Form.Item>

        {/* Purpose of Authorization */}
        <Form.Item
          label="Purpose of Authorization"
          name="purposeOfAuthorization"
          rules={[{ required: true, message: "Please input the purpose!" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter the purpose of authorization"
          />
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

export default AuthRequest;
