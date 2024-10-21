import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Total Requests",
            data: data.values,
            backgroundColor: [
              "rgba(255, 99, 132, 1)", // Red
              "rgba(54, 162, 235, 1)", // Blue
              "rgba(255, 206, 86, 1)", // Yellow
              "rgba(75, 192, 192, 1)", // Teal
              "rgba(153, 102, 255, 1)", // Purple
              "rgba(255, 159, 64, 1)", // Orange
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)", // Red
              "rgba(54, 162, 235, 1)", // Blue
              "rgba(255, 206, 86, 1)", // Yellow
              "rgba(75, 192, 192, 1)", // Teal
              "rgba(153, 102, 255, 1)", // Purple
              "rgba(255, 159, 64, 1)", // Orange
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
