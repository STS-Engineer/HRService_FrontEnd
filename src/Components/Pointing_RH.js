import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Form, Input, notification } from "antd";

const PointingManagementRH = () => {
  const [pointeuses, setPointeuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch pointeuses from the API
  useEffect(() => {
    const fetchPointeuses = async () => {
      try {
        const response = await fetch("/api/pointeuses");
        const data = await response.json();
        setPointeuses(data);
      } catch (error) {
        console.error("Error fetching pointeuses:", error);
        notification.error({ message: "Error fetching pointeuses" });
      } finally {
        setLoading(false);
      }
    };

    fetchPointeuses();
  }, []);

  // Handle adding a new pointeuse
  const handleAddPointeuse = async (values) => {
    try {
      const response = await fetch("/api/pointeuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const newPointeuse = await response.json();
        setPointeuses((prev) => [...prev, newPointeuse]);
        notification.success({ message: "Pointeuse added successfully" });
        setIsModalVisible(false);
        form.resetFields();
      } else {
        notification.error({ message: "Failed to add pointeuse" });
      }
    } catch (error) {
      console.error("Error adding pointeuse:", error);
      notification.error({ message: "Error adding pointeuse" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pointing Management</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add New Pointeuse
      </Button>

      {/* Pointeuse Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          pointeuses.map((pointeuse) => (
            <Col key={pointeuse.id} xs={24} sm={12} md={8} lg={6}>
              <Card title={pointeuse.name} bordered={true}>
                <p>
                  <strong>IP Address:</strong> {pointeuse.ip_address}
                </p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Modal for Adding Pointeuse */}
      <Modal
        title="Add New Pointeuse"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPointeuse}>
          <Form.Item
            name="ip_address"
            label="IP Address"
            rules={[{ required: true, message: "Please enter the IP address" }]}
          >
            <Input placeholder="Enter IP address" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Pointeuse
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default PointingManagementRH;
