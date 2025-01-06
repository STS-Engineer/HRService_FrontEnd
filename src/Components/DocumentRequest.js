import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const DocumentRequest = () => {
  const { t } = useTranslation(); // Use translation function
  const [form] = Form.useForm();
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

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3000/document-requests",
        newDocumentRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: t("successMessage"),
        showConfirmButton: false,
        timer: 2000,
      });

      form.resetFields();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: t("errorTitle"),
        text: t("errorMessage"),
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
        <Form.Item
          label={t("documentRequest.employeeIdLabel")}
          name="employeeId"
          rules={[
            { required: true, message: t("documentRequest.employeeIdError") },
          ]}
        >
          <Input placeholder={t("documentRequest.employeeIdPlaceholder")} />
        </Form.Item>

        <Form.Item
          label={t("documentRequest.documentTypeLabel")}
          name="documentType"
          rules={[
            { required: true, message: t("documentRequest.documentTypeError") },
          ]}
        >
          <Select placeholder={t("documentRequest.documentTypePlaceholder")}>
            <Option value="salary-certificate">
              {t("documentRequest.salaryCertificate")}
            </Option>
            <Option value="work-certificate">
              {t("documentRequest.workCertificate")}
            </Option>
            <Option value="other">{t("documentRequest.other")}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.documentType !== currentValues.documentType
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("documentType") === "other" ? (
              <Form.Item
                label={t("documentRequest.otherDocumentTypeLabel")}
                name="otherDocumentType"
                rules={[
                  {
                    required: true,
                    message: t("documentRequest.otherDocumentTypeError"),
                  },
                ]}
              >
                <Input
                  placeholder={t(
                    "documentRequest.otherDocumentTypePlaceholder"
                  )}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          label={t("documentRequest.documentPurposeLabel")}
          name="documentPurpose"
        >
          <Input
            placeholder={t("documentRequest.documentPurposePlaceholder")}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitting
              ? t("documentRequest.submitting")
              : t("documentRequest.applyButton")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DocumentRequest;
