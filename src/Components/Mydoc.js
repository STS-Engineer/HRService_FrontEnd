import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";

const MyDoc = ({ user }) => {
  const [documentRequests, setDocumentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGetAllDocumentRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User:", user); // Debug line
        const response = await fetch(
          `http://localhost:3000/document-requests/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doc requests");
        }
        const data = await response.json();
        console.log("Fetched documents:", data); // Debug line
        setDocumentRequests(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching doc requests:", error);
        setError(error.message || "Failed to fetch doc requests");
      } finally {
        setLoading(false);
      }
    };
    handleGetAllDocumentRequests();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : documentRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentRequests.map((doc) => (
                <tr key={doc.id}>
                  {" "}
                  {/* Use doc.id for unique key */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.document_type || "N/A"}{" "}
                    {/* Match field name from API */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === "Pending"
                          ? "bg-yellow-400 text-white"
                          : doc.status === "Completed"
                          ? "bg-green-400 text-white"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.file_path ? (
                      <a
                        href={`https://hr-back-end.azurewebsites.net/document-requests/download/${doc.file_path}`}
                        download
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaDownload className="inline-block mr-2" />
                        Download
                      </a>
                    ) : (
                      <p>No file available</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-lg text-gray-500">
          There are no documents available for this employee.
        </p>
      )}
    </div>
  );
};

export default MyDoc;
