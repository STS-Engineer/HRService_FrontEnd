import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

const DocumentAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingRequestId, setUploadingRequestId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://bhr-avocarbon.azurewebsites.net/document-requests"
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (requestId) => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("documentFile", selectedFile);

    try {
      setUploading(true);
      setUploadingRequestId(requestId);
      await axios.post(
        `http://bhr-avocarbon.azurewebsites.net/document-requests/upload/${requestId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("The document is sent successfully!");
      setSelectedFile(null);
      setUploadingRequestId(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Document Requests</h2>
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 mb-4 rounded-lg border border-green-200">
          {successMessage}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                First Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Name
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.requestid} className="hover:bg-gray-100">
                <td className="px-2 py-3 text-sm text-gray-500">
                  {request.firstname}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  {request.lastname}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  {request.documenttype}
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === "Pending"
                        ? "bg-yellow-400 text-white"
                        : request.status === "Completed"
                        ? "bg-green-400 text-white"
                        : "bg-red-400 text-white"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-2 py-3 text-sm text-gray-500">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm text-gray-600 file:py-1 file:px-2 file:border file:border-gray-300 file:rounded-lg file:bg-gray-50 file:text-gray-700 file:cursor-pointer"
                  />
                  <button
                    onClick={() => handleUpload(request.requestid)}
                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center mt-2 ${
                      uploading && uploadingRequestId === request.requestid
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      uploading && uploadingRequestId === request.requestid
                    }
                  >
                    {uploading && uploadingRequestId === request.requestid ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <FaUpload className="inline-block mr-2" />
                        Upload
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentAdmin;
