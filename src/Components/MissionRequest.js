import React, { useState } from "react";
import { Input, Button, DatePicker, Form, TimePicker } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { useTranslation } from "react-i18next";

const MissionRequest = () => {
  const { t } = useTranslation();
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
        "http://localhost:3000/mission-requests",
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
        title: t("missionRequest.successTitle"),
        text: t("missionRequest.successMessage"),
        icon: "success",
      });
      form.resetFields();
    } catch (error) {
      // Handle error and show alert
      Swal.fire({
        title: t("missionRequest.errorTitle"),
        text: t("missionRequest.errorMessage"),
        icon: "error",
      });
      setError(error.response ? error.response.data.error : t("genericError"));
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
          label={t("missionRequest.serialNumber")}
          name={t("missionRequest.serialNumberPlaceholder")}
          rules={[
            {
              required: true,
              message: t("missionRequest.EmployeeIDPlaceholder"),
            },
          ]}
        >
          <Input placeholder={t("missionRequest.serialNumberPlaceholder")} />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          label={t("missionRequest.phone")}
          name="phone"
          rules={[
            { required: true, message: t("missionRequest.PhonePlaceholder") },
          ]}
        >
          <Input placeholder={t("missionRequest.phonePlaceholder")} />
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          label={t("missionRequest.startDate")}
          name="startDate"
          rules={[
            {
              required: true,
              message: t("missionRequest.DatePlaceholder"),
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label={t("missionRequest.endDate")}
          name="endDate"
          rules={[
            { required: true, message: t("missionRequest.DatePlaceholder") },
          ]}
        >
          <DatePicker format="DD-MM-YYYY" disabledDate={disabledEndDate} />
        </Form.Item>
        {/* Mission Budget */}
        <Form.Item
          label={t("missionRequest.missionBudget")}
          name="missionBudget"
          rules={[
            {
              required: true,
              message: t("missionRequest.missionBudgetPlaceholder"),
            },
          ]}
        >
          <Input placeholder={t("missionRequest.missionBudgetPlaceholder")} />
        </Form.Item>

        {/* Purpose of Travel */}
        <Form.Item
          label={t("missionRequest.purposeOfTravel")}
          name="purposeOfTravel"
          rules={[
            { required: true, message: t("missionRequest.purposeOfTravel") },
          ]}
        >
          <Input.TextArea
            placeholder={t("missionRequest.purposeOfTravelPlaceholder")}
          />
        </Form.Item>

        {/* Destination */}
        <Form.Item
          label={t("missionRequest.destination")}
          name="destination"
          rules={[
            {
              required: true,
              message: t("missionRequest.destinationPlaceholder"),
            },
          ]}
        >
          <Input
            placeholder={t("missionRequest.EnterDestinationPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          label={t("missionRequest.departureTime")}
          name="departureTime"
          rules={[
            {
              required: true,
              message: t("missionRequest.departureTimePlaceholder"),
            },
          ]}
        >
          <TimePicker
            use12Hours
            format="h:mm A"
            placeholder={t("missionRequest.SelectTimePlaceholder")}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitting
              ? t("leaveRequest.submitButtonLoading")
              : t("leaveRequest.applyButton")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MissionRequest;
