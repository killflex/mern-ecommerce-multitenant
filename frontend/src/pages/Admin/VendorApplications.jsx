import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetAllApplicationsQuery,
  useApproveApplicationMutation,
  useDeclineApplicationMutation,
  useSetUnderReviewMutation,
} from "../../redux/api/tenantApplicationApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Modal from "../../components/Modal";

const VendorApplications = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // approve, decline, review
  const [adminNotes, setAdminNotes] = useState("");
  const [commissionRate, setCommissionRate] = useState(10);

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useGetAllApplicationsQuery({
    pageNumber: currentPage,
    pageSize: 10,
    status: statusFilter,
  });

  const [approveApplication, { isLoading: approving }] =
    useApproveApplicationMutation();
  const [declineApplication, { isLoading: declining }] =
    useDeclineApplicationMutation();
  const [setUnderReview, { isLoading: reviewing }] =
    useSetUnderReviewMutation();

  // Check if user is admin
  if (!userInfo?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Message variant="error">
          Access denied. Admin privileges required.
        </Message>
      </div>
    );
  }

  // Debug function to test API connectivity
  const testAPIConnection = async () => {
    try {
      const response = await fetch("/api/tenant-applications/test", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log("API Test Result:", data);
      toast.success("API connection working!");
    } catch (error) {
      console.error("API Test Failed:", error);
      toast.error("API connection failed!");
    }
  };

  const handleAction = (application, action) => {
    setSelectedApplication(application);
    setModalType(action);
    setAdminNotes("");
    setCommissionRate(10);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedApplication) return;

    console.log(
      "Confirming action:",
      modalType,
      "for application:",
      selectedApplication._id
    );

    try {
      const payload = {
        id: selectedApplication._id,
        adminNotes,
      };

      console.log("Payload:", payload);

      switch (modalType) {
        case "approve":
          payload.commissionRate = commissionRate;
          console.log("Approving with payload:", payload);
          const approveResult = await approveApplication(payload).unwrap();
          console.log("Approve result:", approveResult);
          toast.success("Application approved successfully!");
          break;
        case "decline":
          console.log("Declining with payload:", payload);
          const declineResult = await declineApplication(payload).unwrap();
          console.log("Decline result:", declineResult);
          toast.success("Application declined.");
          break;
        case "review":
          console.log("Setting under review with payload:", payload);
          const reviewResult = await setUnderReview(payload).unwrap();
          console.log("Review result:", reviewResult);
          toast.success("Application set under review.");
          break;
        default:
          throw new Error("Unknown action type");
      }

      setShowModal(false);
      setSelectedApplication(null);
      refetch();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(error?.data?.message || error?.message || "Action failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "under_review":
        return "bg-blue-500";
      case "approved":
        return "bg-green-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Message variant="error">{error?.data?.message || error.error}</Message>
    );
  }

  const { applications = [], total = 0, pages = 1 } = applicationsData || {};

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Vendor Applications
              </h1>
              <p className="text-gray-400">
                Manage and review vendor applications
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={testAPIConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Test API
              </button>
              <button
                onClick={refetch}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>

          <div className="text-gray-400 flex items-center">
            Total: {total} applications
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">
                          {application.businessName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {application.user?.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-white">
                          {application.businessEmail}
                        </div>
                        <div className="text-gray-400">
                          {application.businessPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-white capitalize">
                          {application.businessPlan}
                        </div>
                        <div className="text-gray-400">
                          $
                          {application.expectedMonthlyRevenue?.toLocaleString()}
                          /mo
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/applications/${application._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          View
                        </button>

                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleAction(application, "review")
                              }
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Review
                            </button>
                            <button
                              onClick={() =>
                                handleAction(application, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAction(application, "decline")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {application.status === "under_review" && (
                          <>
                            <button
                              onClick={() =>
                                handleAction(application, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAction(application, "decline")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No applications found</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition duration-200"
              >
                Previous
              </button>

              <span className="px-4 py-2 bg-gray-700 text-white rounded-lg">
                Page {currentPage} of {pages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(pages, currentPage + 1))}
                disabled={currentPage === pages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">
            {modalType === "approve" && "Approve Application"}
            {modalType === "decline" && "Decline Application"}
            {modalType === "review" && "Set Under Review"}
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              rows={4}
              placeholder="Add notes for the applicant..."
            />
          </div>

          {modalType === "approve" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Commission Rate (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                min="0"
                max="50"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmAction}
              disabled={approving || declining || reviewing}
              className={`px-4 py-2 text-white rounded-lg transition duration-200 ${
                modalType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : modalType === "decline"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {approving || declining || reviewing
                ? "Processing..."
                : modalType === "approve"
                ? "Approve Application"
                : modalType === "decline"
                ? "Decline Application"
                : "Set Under Review"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VendorApplications;
