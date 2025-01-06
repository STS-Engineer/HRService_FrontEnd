import React, { useState } from "react";
import SidebarAdmin from "./SideBarAdmin";
import TopBarAdmin from "./TopBarAdmin";

const DocumentManagement = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const certificateUrl = e.target.result;
          const employeeName = file.name.split(".")[0]; // Assuming the file name is employeeName.pdf
          addSalaryCertificate({ employeeName, certificateUrl });
        };
        reader.readAsDataURL(file);
      });
      setMessage("Salary certificates uploaded successfully.");
      setSelectedFiles([]);
    } else {
      setMessage("Please select files.");
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBarAdmin />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-4">
                Upload Salary Certificates
              </h2>
              <input type="file" multiple onChange={handleFileChange} />
              <button onClick={handleUpload} className="button mt-2">
                Upload
              </button>
              {message && <p className="mt-2 text-green-600">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
