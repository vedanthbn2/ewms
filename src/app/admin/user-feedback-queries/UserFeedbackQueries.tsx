"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../../sign-in/auth";
import { useRouter } from "next/navigation";

interface UserFeedback {
  id: string;
  name: string;
  email: string;
  message: string;
  adminResponse: string;
  createdAt: string;
}

const TRUNCATE_LENGTH = 50;

const UserFeedbackQueries: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<UserFeedback | null>(null);
  const [responseText, setResponseText] = useState("");
  const [limit, setLimit] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"reply" | "view">("view");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const user = getUser();
        if (!token || !user || user.role !== "admin") {
          window.location.href = "/sign-in";
          return;
        }
        // Fetch pickup requests count to set limit
        const pickupRes = await axios.get("/api/recycling-requests");
        setLimit(pickupRes.data.length);

        // Fetch user feedbacks
        const feedbackRes = await axios.get("/api/contactus");
        const feedbacksRaw = feedbackRes.data;

        // Fetch user profiles for emails in feedbacks
        const emails = feedbacksRaw.map((fb: any) => fb.email);
        const uniqueEmails = Array.from(new Set(emails));
        const userProfilesRes = await axios.post("/api/users/list", { emails: uniqueEmails });
        const userProfiles = userProfilesRes.data || [];

        // Map feedbacks to replace name and email with user profile data if found
        const feedbacksMapped = feedbacksRaw.map((fb: any) => {
          const userProfile = userProfiles.find((u: any) => u.email === fb.email);
          return {
            id: fb._id || Math.random().toString(36).substr(2, 9),
            name: userProfile?.name || fb.name || "",
            email: userProfile?.email || fb.email || "",
            message: fb.message || "",
            adminResponse: fb.adminResponse || "",
            createdAt: fb.createdAt || new Date().toISOString(),
          };
        });

        setFeedbacks(feedbacksMapped);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openReplyModal = (feedback: UserFeedback) => {
    setCurrentFeedback(feedback);
    setResponseText(feedback.adminResponse || "");
    setModalMode("reply");
    setModalOpen(true);
  };

  const openViewModal = (feedback: UserFeedback) => {
    setCurrentFeedback(feedback);
    setModalMode("view");
    setModalOpen(true);
  };

  const closeReplyModal = () => {
    setModalOpen(false);
    setCurrentFeedback(null);
    setResponseText("");
  };

  const handleSubmitResponse = async () => {
    if (!currentFeedback) return;
    try {
      const token = getToken();
      if (!token) {
        alert("Unauthorized");
        return;
      }
      await axios.patch(`/api/contactus/${currentFeedback.id}`, { adminResponse: responseText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Response sent successfully");
      setFeedbacks(prev =>
        prev.map(fb => fb.id === currentFeedback.id ? { ...fb, adminResponse: responseText } : fb)
      );
      closeReplyModal();
      // router.push(`/admin/users?email=${encodeURIComponent(currentFeedback.email)}`);
    } catch (error) {
      console.error("Error sending response:", error);
      alert("Failed to send response");
    }
  };

  if (loading) {
    return <div className="p-8">Loading user feedback and queries...</div>;
  }

  const displayedFeedbacks = limit !== null ? feedbacks.slice(0, limit) : feedbacks;

  const truncateMessage = (msg: string) => {
    if (msg.length <= TRUNCATE_LENGTH) return msg;
    return msg.slice(0, TRUNCATE_LENGTH) + "...";
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold mb-8">User Feedback & Queries</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md cursor-pointer">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedFeedbacks.map((fb, index) => (
              <tr key={fb.id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{fb.name}</td>
                <td className="py-3 px-4">{fb.email}</td>
                <td
                  className="py-3 px-4 max-w-xs truncate"
                  onClick={() => openViewModal(fb)}
                  title={fb.message}
                  style={{ cursor: "pointer" }}
                >
                  {truncateMessage(fb.message)}
                </td>
                <td className="py-3 px-4">{new Date(fb.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  {!fb.adminResponse ? (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                      onClick={() => openReplyModal(fb)}
                    >
                      Reply
                    </button>
                  ) : (
                    <span className="text-gray-500 font-semibold">Replied</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && currentFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "reply" ? "Reply to User" : "User Message"}
            </h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                {modalMode === "reply" ? "User Message:" : ""}
              </label>
              <div className="p-3 border border-gray-300 rounded-md max-h-40 overflow-y-auto whitespace-pre-wrap">
                {currentFeedback.message}
              </div>
            </div>
            {modalMode === "reply" && (
              <div className="mb-4">
                <label htmlFor="response" className="block font-semibold mb-1">Your Response:</label>
                <textarea
                  id="response"
                  className="w-full border border-gray-300 rounded-md p-2 resize-y"
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                />
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                onClick={closeReplyModal}
              >
                Close
              </button>
              {modalMode === "reply" && (
                <button
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
                  onClick={handleSubmitResponse}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeedbackQueries;
