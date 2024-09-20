import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle delete employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setEmployees(employees.filter((employee) => employee.id !== id));
      } catch (error) {
        console.error("Error deleting employee", error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Management</h2>
        <Link
          to="/add-employee"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Employee
        </Link>
      </div>

      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border">First Name</th>
              <th className="py-2 px-4 border">Last Name</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border">{employee.firstname}</td>
                <td className="py-2 px-4 border">{employee.lastname}</td>
                <td className="py-2 px-4 border">{employee.department}</td>
                <td className="py-2 px-4 border">{employee.role}</td>
                <td className="py-2 px-4 border">
                  <Link
                    to={`/edit-employee/${employee.id}`}
                    className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeManagement;
