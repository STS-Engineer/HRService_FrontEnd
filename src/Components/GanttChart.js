// // src/Components/GanttChart.js

// import React, { useEffect, useRef } from "react";
// import Gantt from "frappe-gantt";

// const GanttChart = () => {
//   const ganttRef = useRef(null);

//   const tasks = [

//     {
//       id: "Task 1",
//       name: "Design",
//       start: "2024-10-01",
//       end: "2024-10-05",
//       progress: 20,
//     },
//     {
//       id: "Task 2",
//       name: "Development",
//       start: "2024-10-06",
//       end: "2024-10-10",
//       progress: 50,
//     },
//     {
//       id: "Task 3",
//       name: "Testing",
//       start: "2024-10-11",
//       end: "2024-10-15",
//       progress: 80,
//     },
//   ];

//   useEffect(() => {
//     new Gantt(ganttRef.current, tasks, {
//       view_mode: "Day",
//       language: "en",
//     });
//   }, [tasks]);

//   return <div ref={ganttRef}></div>;
// };

// export default GanttChart;
