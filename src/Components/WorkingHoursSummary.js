import React, { useState } from "react";
import { DatePicker, Table, Button, message, Spin, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;

const WorkingHoursSummary = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange([]);
    }
  };

  const fetchWorkingHours = async () => {
    if (!dateRange || dateRange.length !== 2) {
      message.error("Please select a valid date range.");
      return;
    }

    try {
      setLoading(true);
      const [fromDate, toDate] = dateRange;
      const formattedFromDate = moment(fromDate).format("YYYY-MM-DD");
      const formattedToDate = moment(toDate).format("YYYY-MM-DD");
      const response = await axios.get(
        "https://bhr-avocarbon.azurewebsites.net/pointing/logs/working_hours",
        {
          params: { fromDate: formattedFromDate, toDate: formattedToDate },
        }
      );

      setData(response.data);
      message.success("Data fetched successfully!");
    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    if (!dateRange || dateRange.length !== 2) {
      message.error("Please select a valid date range.");
      return;
    }

    try {
      const [fromDate, toDate] = dateRange;
      const formattedFromDate = moment(fromDate).format("YYYY-MM-DD");
      const formattedToDate = moment(toDate).format("YYYY-MM-DD");

      const response = await axios.get(
        "https://bhr-avocarbon.azurewebsites.net/pointing/working_hours",
        {
          params: { fromDate: formattedFromDate, toDate: formattedToDate },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `working_hours_${formattedFromDate}_to_${formattedToDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("File exported successfully!");
    } catch (error) {
      console.error("Export Error:", error.response?.data || error.message);
      message.error("Failed to export data.");
    }
  };

  const columns = [
    { title: "Matricule", dataIndex: "matricule", key: "matricule" },
    { title: "Firstname", dataIndex: "firstname", key: "firstname" },
    { title: "Lastname", dataIndex: "lastname", key: "lastname" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
    { title: "Working Hours", dataIndex: "workingHours", key: "workingHours" },
  ];

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <h2 className="text-2xl font-bold mb-4">Pointing Management</h2>

      {/* Controls Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <RangePicker
          onChange={handleDateChange}
          className="w-full sm:w-auto"
          value={dateRange}
          format="YYYY-MM-DD"
          disabledDate={(current) => current && current > moment().endOf("day")}
        />
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={fetchWorkingHours}
          loading={loading}
          icon="🔍"
        >
          Fetch Data
        </Button>
        <Button
          type="default"
          shape="round"
          size="large"
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          ghost
        >
          Export to Excel
        </Button>
      </div>

      {/* Data Table */}
      {loading ? (
        <Spin tip="Loading data..." />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey={(record) =>
            `${record.matricule}_${record.firstname}_${record.lastname}`
          }
          bordered
          pagination={{ pageSize: 5 }}
          locale={{
            emptyText: "No data available for the selected date range.",
          }}
        />
      )}
    </Card>
  );
};

export default WorkingHoursSummary;
