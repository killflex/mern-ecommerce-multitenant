import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetMyApplicationQuery } from "../../redux/api/tenantApplicationApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: application,
    isLoading,
    error,
    refetch,
  } = useGetMyApplicationQuery();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    if (userInfo.isVendor) {
      navigate("/vendor/dashboard");
      return;
    }
  }, [userInfo, navigate]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "under_review":
        return "🔍";
      case "approved":
        return "✅";
      case "declined":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Your application is in queue for review. We'll get back to you within 2-5 business days.";
      case "under_review":
        return "Our team is currently reviewing your application. This process may take 1-3 business days.";
      case "approved":
        return "Congratulations! Your vendor application has been approved. You can now start selling on our platform.";
      case "declined":
        return "We're sorry, but your application was not approved at this time. Please see the feedback below.";
      default:
        return "Unknown status";
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Message variant="error">
            {error?.data?.message || "Failed to load application"}
          </Message>
          <button
            onClick={() => navigate("/become-vendor")}
            className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Submit New Application
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            No Application Found
          </h2>
          <p className="text-gray-400 mb-6">
            You haven't submitted a vendor application yet.
          </p>
          <button
            onClick={() => navigate("/become-vendor")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition duration-200"
          >
            Start Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Vendor Application Status
          </h1>
          <p className="text-gray-300">
            Track the progress of your vendor application
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">
                {getStatusIcon(application.status)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {application.businessName}
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Applied on{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={refetch}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Refresh
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <p className="text-gray-300">
              {getStatusMessage(application.status)}
            </p>
          </div>

          {/* Admin Notes */}
          {application.adminNotes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Admin Feedback
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-300">{application.adminNotes}</p>
                {application.reviewedBy && application.reviewedAt && (
                  <div className="mt-3 text-sm text-gray-400">
                    Reviewed on{" "}
                    {new Date(application.reviewedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Business Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Business Plan:</span>
                  <span className="text-white ml-2 capitalize">
                    {application.businessPlan}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Expected Revenue:</span>
                  <span className="text-white ml-2">
                    ${application.expectedMonthlyRevenue?.toLocaleString()}
                    /month
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Categories:</span>
                  <span className="text-white ml-2">
                    {application.productCategories?.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">
                    {application.businessEmail}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-2">
                    {application.businessPhone}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white ml-2">
                    {application.businessAddress?.city},{" "}
                    {application.businessAddress?.state}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {application.status === "approved" && (
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Go to Vendor Dashboard
            </button>
          )}

          {application.status === "declined" && (
            <button
              onClick={() => navigate("/become-vendor")}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition duration-200"
            >
              Submit New Application
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-200"
          >
            Back to Home
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
          <p className="text-gray-300 text-sm mb-4">
            If you have questions about your application or need assistance,
            don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
              Contact Support
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200">
              View Guidelines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
