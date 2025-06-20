"use client";

import React, { useEffect, useState } from "react";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/receivers");
        const result = await response.json();
        if (result.success) {
          setEmployees(result.data);
        } else {
          setError(result.message || "Failed to fetch employees");
        }
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const openMessageModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setMessageText("");
    setModalOpen(true);
  };

  const closeMessageModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
    setMessageText("");
  };

  const handleSendMessage = async () => {
    if (!selectedEmployee) return;
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedEmployee.id, message: messageText }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Message sent successfully");
        closeMessageModal();
      } else {
        alert(result.message || "Failed to send message");
      }
    } catch (error) {
      alert("Failed to send message");
    }
  };

  if (loading) {
    return <div className="p-8">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Employees</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{emp.name}</td>
                <td className="py-3 px-4">{emp.email}</td>
                <td className="py-3 px-4">{emp.id}</td>
                <td className="py-3 px-4">{emp.phone}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={() => openMessageModal(emp)}
                  >
                    Send Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message Modal */}
      {modalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Send Message to {selectedEmployee.name}</h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 resize-y mb-4"
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message here..."
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={closeMessageModal}
              >
                Cancel
              </button>
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
