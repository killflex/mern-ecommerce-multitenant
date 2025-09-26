import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetVendorDashboardQuery } from "../../redux/api/vendorApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetVendorDashboardQuery();

  useEffect(() => {
    if (!userInfo?.isVendor) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Message variant="error">{error?.data?.message || error.error}</Message>
    );
  }

  const { vendor, stats } = dashboardData || {};

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Vendor Dashboard
              </h1>
              <p className="text-gray-400">
                Welcome back, {vendor?.businessName}!
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalProducts || 0}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Products</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.activeProducts || 0}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-white">
                  ${stats?.totalSales?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rating</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.rating?.toFixed(1) || "0.0"} ⭐
                </p>
                <p className="text-xs text-gray-500">
                  {stats?.reviewCount || 0} reviews
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/vendor/products/add")}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition duration-200"
              >
                Add New Product
              </button>
              <button
                onClick={() => navigate("/vendor/products")}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200"
              >
                Manage Products
              </button>
              <button
                onClick={() => navigate("/vendor/profile")}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Business Info
            </h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Business Name</p>
              <p className="text-white font-medium">{vendor?.businessName}</p>
              <p className="text-gray-400 text-sm mt-3">Commission Rate</p>
              <p className="text-white font-medium">
                {vendor?.commissionRate}%
              </p>
              <p className="text-gray-400 text-sm mt-3">Status</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  vendor?.isActive
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {vendor?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Help & Support
            </h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Need help? Contact our support team or check our vendor
                guidelines.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
                Contact Support
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-200">
                Vendor Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
