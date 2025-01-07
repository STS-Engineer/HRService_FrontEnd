import React, { useState } from "react";
import { Form, Input, Button, DatePicker, TimePicker } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { useTranslation } from "react-i18next"; // Import translation hook

const AuthRequest = () => {
  const { t } = useTranslation(); // Initialize translation
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    const formData = {
      ...values,
      authorizationDate: values.authorizationDate
        ? values.authorizationDate.format("YYYY-MM-DD")
        : "",
      departureTime: values.departureTime
        ? values.departureTime.format("HH:mm:ss")
        : "",
      returnTime: values.returnTime ? values.returnTime.format("HH:mm:ss") : "",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
      await axios.post(
        "https://bhr-avocarbon.azurewebsites.net/authorization-requests",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitting(false);
      Swal.fire(
        t("authRequest.successTitle"),
        t("authRequest.successMessage"),
        "success"
      );

      form.resetFields();
    } catch (error) {
      Swal.fire(
        t("authRequest.errorTitle"),
        error.response
          ? error.response.data.error
          : t("authRequest.errorMessage"),
        "error"
      );
      setSubmitting(false);
    }
  };

  const today = moment();

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Employee ID */}
        <Form.Item
          label={t("authRequest.serialNumber")}
          name="employeeId"
          rules={[
            {
              required: true,
              message: t("authRequest.serialNumberPlaceholder"),
            },
          ]}
        >
          <Input placeholder={t("authRequest.serialNumberPlaceholder")} />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label={t("authRequest.phone")}
          name="phone"
          rules={[
            { required: true, message: t("authRequest.phonePlaceholder") },
          ]}
        >
          <Input placeholder={t("authRequest.phonePlaceholder")} />
        </Form.Item>

        {/* Authorization Date */}
        <Form.Item
          label={t("authRequest.authorizationDate")}
          name="authorizationDate"
          rules={[
            {
              required: true,
              message: t("authRequest.authorizationDatePlaceholder"),
            },
          ]}
        >
          <DatePicker
            style={{ width: "20%" }}
            disabledDate={(current) => current && current < today}
          />
        </Form.Item>

        {/* Departure and Return Time */}
        <Form.Item label={t("authRequest.departureTime")} name="departureTime">
          <TimePicker
            style={{ width: "20%" }}
            format="HH:mm:ss"
            placeholder={t("authRequest.departureTimePlaceholder")}
          />
        </Form.Item>
        <Form.Item label={t("authRequest.returnTime")} name="returnTime">
          <TimePicker
            style={{ width: "20%" }}
            format="HH:mm:ss"
            placeholder={t("authRequest.returnTimePlaceholder")}
          />
        </Form.Item>
        {/* Purpose of Authorization */}
        <Form.Item
          label={t("authRequest.purposeOfAuthorization")}
          name="purposeOfAuthorization"
          rules={[
            {
              required: true,
              message: t("authRequest.purposeOfAuthorizationPlaceholder"),
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t("authRequest.purposeOfAuthorizationPlaceholder")}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitting
              ? t("authRequest.submitting")
              : t("authRequest.submitButton")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AuthRequest;
