import { apiSlice } from "./apiSlice";
const TENANT_APPLICATIONS_URL = "/api/tenant-applications";

export const tenantApplicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitTenantApplication: builder.mutation({
      query: (applicationData) => ({
        url: TENANT_APPLICATIONS_URL,
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["TenantApplication"],
    }),

    getMyApplication: builder.query({
      query: () => ({
        url: `${TENANT_APPLICATIONS_URL}/my-application`,
      }),
      providesTags: ["TenantApplication"],
    }),

    updateMyApplication: builder.mutation({
      query: (applicationData) => ({
        url: `${TENANT_APPLICATIONS_URL}/my-application`,
        method: "PUT",
        body: applicationData,
      }),
      invalidatesTags: ["TenantApplication"],
    }),

    // Admin endpoints
    getAllApplications: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, status = "" }) => ({
        url: `${TENANT_APPLICATIONS_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`,
      }),
      providesTags: ["TenantApplication"],
    }),

    getApplicationById: builder.query({
      query: (id) => ({
        url: `${TENANT_APPLICATIONS_URL}/${id}`,
      }),
      providesTags: ["TenantApplication"],
    }),

    approveApplication: builder.mutation({
      query: ({ id, adminNotes, commissionRate }) => ({
        url: `${TENANT_APPLICATIONS_URL}/${id}/approve`,
        method: "PUT",
        body: { adminNotes, commissionRate },
      }),
      invalidatesTags: ["TenantApplication"],
    }),

    declineApplication: builder.mutation({
      query: ({ id, adminNotes }) => ({
        url: `${TENANT_APPLICATIONS_URL}/${id}/decline`,
        method: "PUT",
        body: { adminNotes },
      }),
      invalidatesTags: ["TenantApplication"],
    }),

    setUnderReview: builder.mutation({
      query: ({ id, adminNotes }) => ({
        url: `${TENANT_APPLICATIONS_URL}/${id}/under-review`,
        method: "PUT",
        body: { adminNotes },
      }),
      invalidatesTags: ["TenantApplication"],
    }),
  }),
});

export const {
  useSubmitTenantApplicationMutation,
  useGetMyApplicationQuery,
  useUpdateMyApplicationMutation,
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useApproveApplicationMutation,
  useDeclineApplicationMutation,
  useSetUnderReviewMutation,
} = tenantApplicationApiSlice;
