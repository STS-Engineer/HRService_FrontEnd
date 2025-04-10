import React, { useState, useEffect } from "react";
import { Table, DatePicker, Button, message, Spin, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;

const PointingReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [weekRanges, setWeekRanges] = useState([]);

  useEffect(() => {
    if (dates.length) {
      setWeekRanges(getWeekRanges(dates[0]));
    }
  }, [dates]);

  const fetchData = async () => {
    if (!dates.length) {
      message.warning("Please select a date range.");
      return;
    }

    setLoading(true);
    try {
      const [startDate, endDate] = dates;
      const response = await axios.get(
        `https://bhr-avocarbon.azurewebsites.net/pointing/logs/working_hours_monthly?startDate=${startDate}&endDate=${endDate}`
      );
      setData(response.data);
    } catch (error) {
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const getWeekRanges = (startDate) => {
    let weeks = [];
    let start = moment(startDate).startOf("month");
    for (let i = 0; i < 4; i++) {
      let end = start.clone().add(6, "days");
      weeks.push(`${start.format("DD MMM")} - ${end.format("DD MMM")}`);
      start = end.clone().add(1, "day");
    }
    return weeks;
  };

  const columns = [
    { title: "Matricule", dataIndex: "matricule", key: "matricule" },
    { title: "First Name", dataIndex: "firstname", key: "firstname" },
    { title: "Last Name", dataIndex: "lastname", key: "lastname" },
    {
      title: weekRanges.length ? `Week 1 (${weekRanges[0]})` : "Week 1",
      dataIndex: "W1",
      key: "W1",
      render: (week) => week.total || "-",
    },
    {
      title: weekRanges.length ? `Week 2 (${weekRanges[1]})` : "Week 2",
      dataIndex: "W2",
      key: "W2",
      render: (week) => week.total || "-",
    },
    {
      title: weekRanges.length ? `Week 3 (${weekRanges[2]})` : "Week 3",
      dataIndex: "W3",
      key: "W3",
      render: (week) => week.total || "-",
    },
    {
      title: weekRanges.length ? `Week 4 (${weekRanges[3]})` : "Week 4",
      dataIndex: "W4",
      key: "W4",
      render: (week) => week.total || "-",
    },
    { title: "Total Hours", dataIndex: "total", key: "total" },
  ];

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Working Hours");

    // Generate file and trigger download
    XLSX.writeFile(workbook, "Working_Hours_Report.xlsx");
  };

  return (
    <Card style={{ padding: 20, borderRadius: 10 }}>
      <div style={{ padding: 20 }}>
        <h2 className="text-2xl font-bold mb-4">Working Hours Summary</h2>
        <RangePicker
          format="YYYY-MM-DD"
          onChange={(dates) =>
            setDates(
              dates ? dates.map((date) => date.format("YYYY-MM-DD")) : []
            )
          }
        />
        <Button type="primary" onClick={fetchData} style={{ marginLeft: 10 }}>
          Fetch Data
        </Button>
        <Button
          onClick={handleExportExcel}
          icon={<DownloadOutlined />}
          type="default"
          className="mb-6"
        >
          Download Excel
        </Button>
        {loading ? <Spin style={{ marginLeft: 20 }} /> : null}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="matricule"
          pagination={{ pageSize: 9 }}
          style={{ marginTop: 20 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </Card>
  );
};

export default PointingReports;
