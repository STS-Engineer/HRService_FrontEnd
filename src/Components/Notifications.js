// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000");

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // Listen for notifications
//     socket.on("notification", (notification) => {
//       setNotifications((prevNotifications) => [
//         ...prevNotifications,
//         notification,
//       ]);
//     });

//     return () => {
//       socket.off("notification"); // Clean up the listener
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Notifications</h2>
//       <ul>
//         {notifications.map((notification, index) => (
//           <li key={index}>{notification.message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;
