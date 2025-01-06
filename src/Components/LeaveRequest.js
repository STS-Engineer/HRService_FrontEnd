import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Input, Select, DatePicker, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const LeaveRequest = ({ employeeId }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]);
  const { t } = useTranslation();

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

    // Add requestDate to FormData
    newLeaveRequest.append("requestDate", moment().format("DD-MM-YYYY"));

    try {
      await axios.post(
        "http://localhost:3000/leave-requests",
        newLeaveRequest,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        title: t("leaveRequest..success"),
        text: t("leaveRequest..leaveRequestSubmitted"),
        icon: "success",
      });

      form.resetFields();
      setFileList([]); // Clear the file list after submission
    } catch (error) {
      console.error("Error response:", error.response);
      setError(
        error.response ? error.response.data.error : t("somethingWentWrong")
      );
      Swal.fire({
        title: t("leaveRequest..error"),
        text: t("leaveRequest..leaveRequestFailed"),
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
        title: t("leaveRequest..success"),
        text: `${file.name} ${t("leaveRequest..fileUploadSuccess")}`,
        icon: "success",
      });
    } else if (file.status === "error") {
      Swal.fire({
        title: t("error"),
        text: `${file.name} ${t("leaveRequest..fileUploadFailed")}`,
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
          label={t("leaveRequest.employeeIdLabel")}
          rules={[
            {
              required: true,
              message: t("leaveRequest.validation.employeeIdRequired"),
            },
          ]}
        >
          <Input placeholder={t("leaveRequest.employeeIdPlaceholder")} />
        </Form.Item>
        <Form.Item
          name="leaveType"
          label={t("leaveRequest.leaveTypeLabel")}
          rules={[
            {
              required: true,
              message: t("leaveRequest.validation.leaveTypeRequired"),
            },
          ]}
        >
          <Select placeholder={t("leaveRequest.leaveTypePlaceholder")}>
            <Option value="half_day">
              {t("leaveRequest.leaveTypes.halfDay")}
            </Option>
            <Option value="Wedding">
              {t("leaveRequest.leaveTypes.wedding")}
            </Option>
            <Option value="Business">
              {t("leaveRequest.leaveTypes.business")}
            </Option>
            <Option value="Injury">
              {t("leaveRequest.leaveTypes.injury")}
            </Option>
            <Option value="Sick">{t("leaveRequest.leaveTypes.sick")}</Option>
            <Option value="Maternity">
              {t("leaveRequest.leaveTypes.maternity")}
            </Option>
            <Option value="Funeral">
              {t("leaveRequest.leaveTypes.funeral")}
            </Option>
            <Option value="Annual Leave">
              {t("leaveRequest.leaveTypes.annualLeave")}
            </Option>
            <Option value="Compensatory">
              {t("leaveRequest.leaveTypes.compensatory")}
            </Option>
            <Option value="Without Pay">
              {t("leaveRequest.leaveTypes.withoutPay")}
            </Option>
            <Option value="Seniority">
              {t("leaveRequest.leaveTypes.seniority")}
            </Option>
            <Option value="Other">Other</Option>
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
          label={t("leaveRequest.startDateLabel")}
          rules={[
            {
              required: true,
              message: t("leaveRequest.validation.startDateRequired"),
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            placeholder={t("leaveRequest.DatePlaceholder")}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label={t("leaveRequest.endDateLabel")}
          rules={[
            {
              required: true,
              message: t("leaveRequest.validation.endDateRequired"),
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            placeholder={t("leaveRequest.DatePlaceholder")}
            disabledDate={(current) =>
              current && current < form.getFieldValue("startDate")
            }
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t("leaveRequest.phoneLabel")}
          rules={[
            {
              required: true,
              message: t("leaveRequest.validation.phoneRequired"),
            },
          ]}
        >
          <Input type="tel" placeholder={t("leaveRequest.phonePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="justification"
          label={t("leaveRequest.justificationLabel")}
          rules={[
            {
              required: true,
              message: t("leaveRequest.validation.justificationRequired"),
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t("leaveRequest.justificationPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          name="justificationFile"
          label={t("leaveRequest.justificationFileLabel")}
        >
          <Upload
            accept=".pdf,.doc,.docx,.jpg,.png"
            fileList={fileList} // Bind file list to state
            showUploadList={true}
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>
              {" "}
              {t("leaveRequest.uploadFileButton")}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitting
              ? t("leaveRequest.submitButtonLoading")
              : t("leaveRequest.applyButton")}
          </Button>
        </Form.Item>

        {/* Error message */}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </Form>
    </div>
  );
};

export default LeaveRequest;
