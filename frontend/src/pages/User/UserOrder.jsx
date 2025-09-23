import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4 mt-[10rem]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Orders</h1>
        <Link
          to="/profile"
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Profile
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : orders?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">No orders found</div>
          <Link
            to="/shop"
            className="bg-pink-500 text-white py-2 px-6 rounded hover:bg-pink-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Product
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Order ID
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Date
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Total
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Payment
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Delivery
                    </th>
                    <th className="py-4 px-6 text-left text-white font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img
                            src={order.orderItems[0].image}
                            alt={order.orderItems[0].name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-white font-medium">
                              {order.orderItems[0].name}
                            </div>
                            {order.orderItems.length > 1 && (
                              <div className="text-gray-400 text-sm">
                                +{order.orderItems.length - 1} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-300 font-mono text-sm">
                          ...{order._id.slice(-8)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-semibold">
                          ${order.totalPrice}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {order.isPaid ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <div className="text-white font-medium">
                        {order.orderItems[0].name}
                      </div>
                      {order.orderItems.length > 1 && (
                        <div className="text-gray-400 text-sm">
                          +{order.orderItems.length - 1} more items
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-white font-semibold">
                    ${order.totalPrice}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">Order ID</div>
                    <div className="text-white font-mono text-sm">
                      ...{order._id.slice(-8)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Date</div>
                    <div className="text-white">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {order.isPaid ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Pending
                      </span>
                    )}
                    {order.isDelivered ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Processing
                      </span>
                    )}
                  </div>
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
