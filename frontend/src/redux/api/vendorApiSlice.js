import { apiSlice } from "./apiSlice";
const VENDORS_URL = "/api/vendors";

export const vendorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorDashboard: builder.query({
      query: () => ({
        url: `${VENDORS_URL}/dashboard`,
      }),
      providesTags: ["Vendor"],
    }),

    getVendorProfile: builder.query({
      query: () => ({
        url: `${VENDORS_URL}/profile`,
      }),
      providesTags: ["Vendor"],
    }),

    updateVendorProfile: builder.mutation({
      query: (data) => ({
        url: `${VENDORS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vendor"],
    }),

    getVendorProducts: builder.query({
      query: ({ pageNumber = 1, pageSize = 12, keyword = "" }) => ({
        url: `${VENDORS_URL}/products?pageNumber=${pageNumber}&pageSize=${pageSize}&keyword=${keyword}`,
      }),
      providesTags: ["VendorProduct"],
    }),

    addVendorProduct: builder.mutation({
      query: (productData) => ({
        url: `${VENDORS_URL}/products`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["VendorProduct"],
    }),

    updateVendorProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `${VENDORS_URL}/products/${productId}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["VendorProduct"],
    }),

    deleteVendorProduct: builder.mutation({
      query: (productId) => ({
        url: `${VENDORS_URL}/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VendorProduct"],
    }),

    getVendorOrders: builder.query({
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: `${VENDORS_URL}/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      providesTags: ["VendorOrder"],
    }),
  }),
});

export const {
  useGetVendorDashboardQuery,
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
  useGetVendorProductsQuery,
  useAddVendorProductMutation,
  useUpdateVendorProductMutation,
  useDeleteVendorProductMutation,
  useGetVendorOrdersQuery,
} = vendorApiSlice;
