import React from "react";
import { HomeIcon } from "@heroicons/react/24/outline";

const routeToHeaderMap = {
  "/": {
    title: "Default Dashboard",
    breadcrumbs: ["Home", "Default Dashboard"],
  },
  "/leave-request": {
    title: "Leave Request",
    breadcrumbs: ["Home", "Leave Request"],
  },
  "/mission-request": {
    title: "Mission Request",
    breadcrumbs: ["Home", "Mission Request"],
  },
  "/auth-request": {
    title: "Authorization Request",
    breadcrumbs: ["Home", "Authorization Request"],
  },
  "/document-request": {
    title: "Document Request",
    breadcrumbs: ["Home", "Document Request"],
  },
  " /my-leave": {
    title: "My Leave Requests",
    breadcrumbs: ["Home", "My Leave"],
  },
  " /my-mission": {
    title: "My Mission Requests",
    breadcrumbs: ["Home", "My Mission"],
  },
  " /my-authorisation": {
    title: "My Authorisation Requests",
    breadcrumbs: ["Home", "My Authorisation"],
  },
};

const DynamicHeader = ({ currentPath }) => {
  const currentHeader = routeToHeaderMap[currentPath] || {
    title: "HOME",
    breadcrumbs: ["Home", ""],
  };

  return (
    <div className="bg-white p-4 shadow-sm border-b">
      <h1 className="text-2xl font-semibold text-gray-800">
        {currentHeader.title}
      </h1>
      <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
        <HomeIcon className="h-4 w-4" />
        {currentHeader.breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span>{crumb}</span>
            {index < currentHeader.breadcrumbs.length - 1 && <span>/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DynamicHeader;
