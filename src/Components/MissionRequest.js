import React, { useState } from "react";
import { Input, Button, DatePicker, Form, TimePicker } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

const MissionRequest = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
      // Convert missionBudget to a numeric value
      const numericBudget = parseFloat(
        values.missionBudget.replace(/[^\d.-]/g, "")
      );

      // Format startDate and endDate to 'YYYY-MM-DD'
      const formattedValues = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        missionBudget: numericBudget,
        status: "Pending",
        requestDate: moment().format("YYYY-MM-DD"),
      };
      // POST request to API
      await axios.post(
        "https://bhr-avocarbon.azurewebsites.net/mission-requests",
        formattedValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Show success alert and reset form
      Swal.fire({
        title: "Success!",
        text: "Mission request submitted successfully!",
        icon: "success",
      });
      form.resetFields();
    } catch (error) {
      // Handle error and show alert
      Swal.fire({
        title: "Error!",
        text: "Failed to submit mission request. Please try again later.",
        icon: "error",
      });
      setError(
        error.response ? error.response.data.error : "Something went wrong!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Disable end date before start date
  const disabledEndDate = (endDate) => {
    const startDate = form.getFieldValue("startDate");
    return startDate && endDate.isBefore(startDate, "day");
  };

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Serial Number (Employee ID, ID Number, M.At) */}
        <Form.Item
          label="Serial Number (Employee ID, ID Number, M.At)"
          name="employeeId"
          rules={[{ required: true, message: "Please enter your Employee ID" }]}
        >
          <Input placeholder="Enter your ID" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          label="Phone (Personal Number)"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number" },
          ]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select a start date" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select an end date" }]}
        >
          <DatePicker format="DD-MM-YYYY" disabledDate={disabledEndDate} />
        </Form.Item>
        {/* Mission Budget */}
        <Form.Item
          label="Mission Budget"
          name="missionBudget"
          rules={[{ required: true, message: "Please enter mission budget" }]}
        >
          <Input placeholder="Enter Mission Budget" />
        </Form.Item>

        {/* Purpose of Travel */}
        <Form.Item
          label="Purpose of Travel"
          name="purposeOfTravel"
          rules={[
            { required: true, message: "Please enter the purpose of travel" },
          ]}
        >
          <Input.TextArea placeholder="Enter Purpose of Travel" />
        </Form.Item>

        {/* Destination */}
        <Form.Item
          label="Destination"
          name="destination"
          rules={[{ required: true, message: "Please enter destination" }]}
        >
          <Input placeholder="Enter Destination" />
        </Form.Item>

       <Form.Item
        label="Departure Time"
        name="departureTime"
        rules={[{ required: true, message: "Please select a departure time" }]}
      >
        <TimePicker use12Hours format="h:mm A" placeholder="Select Time" />
      </Form.Item>
      <Form.Item
        label="Return Time"
        name="departureTime"
        rules={[{ required: true, message: "Please select a departure time" }]}
      >
        <TimePicker use12Hours format="h:mm A" placeholder="Select Time" />
      </Form.Item > 

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

export default MissionRequest;
