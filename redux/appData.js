import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { clearCredentials, setCredentials } from "./slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5004/api/",
  // baseUrl: "https://yoamart.com/api",
  // baseUrl: "https://yoamart-be-new.onrender.com/api",
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
  // Custom response handler to handle text responses
  async responseHandler(response, api) {
    const text = await response.text();
    try {
      const jsonResponse = JSON.parse(text);

      if (jsonResponse && jsonResponse.message === "jwt expired") {
        Cookies.remove("token");

        // Dispatch logout to clear Redux state
        api.dispatch(clearCredentials());
        window.location.href = "/my-account";
      }

      return jsonResponse;
    } catch {
      return text; // If JSON parsing fails, return the raw text
    }
  },
});

export const productsApi = createApi({
  reducerPath: "products",
  baseQuery,
  tagTypes: ["Category", "Product", "Order", "OrderID", "Driver", "Batch", "Alert", "AlertRule", "Action"],

  endpoints: (builder) => ({
    // start optimistic updates yet to be tested

    // addCategory: builder.mutation({
    //   query: (formData) => ({
    //     url: "/category/create",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   onQueryStarted: async (arg, {  queryFulfilled }) => {
    //     const patchResult = dispatch(
    //       productsApi.util.updateQueryData("getAllCategory", undefined, (draft) => {
    //         draft.push(arg); // Add the new category optimistically
    //       })
    //     );
    //     try {
    //       await queryFulfilled;
    //     } catch (err) {
    //       patchResult.undo(); // Rollback on error
    //       console.error("Category add failed:", err);
    //     }
    //   },
    //   invalidatesTags: ["Category"],
    // }),

    // end optimistic updates

    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/create",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    verifyToken: builder.mutation({
      query: (credentials) => ({
        url: "/auth/verify-token",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    resendVerifyToken: builder.mutation({
      query: (credentials) => ({
        url: "/auth/resend-token",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        // const { setAuthSession } = useSession();
        try {
          const result = await queryFulfilled;

          const { token } = result.data;

          const decodedToken = jwtDecode(token);
          // const { email, name, userId, role } = decodedToken;
          // console.log(decodedToken);

          // Set credentials in Redux
          dispatch(
            setCredentials({ token: result.data.token, userData: decodedToken })
          );

          // Set the cookie
          // Cookies.set("token", result.data.token);
          Cookies.set("token", result.data.token, {
            expires: 7,
            secure: true,
            sameSite: "strict",
          });
          // const token = result.data.token;
          // setAuthSession(token);
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    lostPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/generate-password-link",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    verifyPasswordLink: builder.mutation({
      query: (credentials) => ({
        url: "/auth/verify-password-link",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/update-password",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    createOrder: builder.mutation({
      query: (credentials) => ({
        url: "/order/create-order",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    updateOrder: builder.mutation({
      query: ({ credentials, orderId }) => ({
        url: `/order/update-order/${orderId}`,
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Order", "OrderID"],
    }),

    getAllUserOrders: builder.query({
      query: () => "/order/user-orders",
      headers: { "Content-Type": "application/json" },
    }),

    getAllOrders: builder.query({
      query: () => "/order/all/orders",
      providesTags: ["Order"],

      headers: { "Content-Type": "application/json" },
    }),

    getUserOrderById: builder.query({
      query: (orderId) => `/order/${orderId}`,
      providesTags: ["OrderID"],
      headers: { "Content-Type": "application/json" },
    }),

    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const result = await queryFulfilled;

          const { token } = result.data; // Assume the response contains the updated token

          // Decode the new token to get user details
          const decodedToken = jwtDecode(token);
          // Update credentials in Redux
          dispatch(
            setCredentials({ token: result.data.token, userData: decodedToken })
          );

          // Update the cookie with the new token
          Cookies.set("token", result.data.token, {
            expires: 7,
            secure: true,
            sameSite: "strict",
          });

          // console.log("Profile updated successfully and session refreshed.");
        } catch (err) {
          console.error("Profile update failed:", err);
        }
      },
    }),

    getAllCategory: builder.query({
      query: () => "/category/all-category",
      providesTags: ["Category"],
      headers: { "Content-Type": "application/json" },
    }),

    getCategoryById: builder.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
    }),

    getAllProduct: builder.query({
      // query: ({ page, limit, category, min, max, sort }) =>
      //   `/product/products?page=${page}&limit=${limit}`,
      query: ({
        page = 1,
        limit = 10,
        category,
        min,
        max,
        sort,
        inStock,
        outOfStock,
      }) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page.toString());
        if (limit) queryParams.append("limit", limit.toString());
        if (category) {
          category.forEach((cat) => {
            queryParams.append("category", cat); // Append each category individually
          });
        }
        if (min) queryParams.append("min", min.toString());
        if (max) queryParams.append("max", max.toString());
        if (sort) queryParams.append("sort", sort);
        if (inStock) queryParams.append("inStock", inStock.toString());
        if (outOfStock) queryParams.append("outOfStock", outOfStock.toString());

        return `/product/products?${queryParams.toString()}`;
      },
      providesTags: ["Product"],
      headers: { "Content-Type": "application/json" },
    }),

    search: builder.query({
      query: ({ title, page = 1, limit = 10 }) =>
        `/search/products?title=${title}&page=${page}&limit=${limit}`,
      headers: { "Content-Type": "application/json" },
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
    }),
    toggleStock: builder.mutation({
      query: (productId) => ({
        url: `/product/stock`,
        method: "POST",
        body: productId,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Product"],
    }),

    isHot: builder.mutation({
      query: (productId) => ({
        url: `/product/isHot`,
        method: "POST",
        body: productId,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Product"],
    }),

    bestSeller: builder.mutation({
      query: (productId) => ({
        url: `/product/isFeatured`,
        method: "POST",
        body: productId,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
        // body: formData,
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          // console.log("registered");
          await queryFulfilled;
        } catch (err) {
          console.error("category delete failed:", err);
        }
      },
      invalidatesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: (credentials) => ({
        url: "/product/create-product",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Product"],
    }),

    editProduct: builder.mutation({
      query: ({ credentials, productId }) => ({
        url: `/product/${productId}`,
        method: "PATCH",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Product"],
    }),

    createCategory: builder.mutation({
      query: (credentials) => ({
        url: "/category/create-category",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Category"],
    }),

    editCategory: builder.mutation({
      query: ({ credentials, categoryId }) => ({
        url: `/category/${categoryId}`,
        method: "PATCH",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
        // body: formData,
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          // console.log("registered");
          await queryFulfilled;
        } catch (err) {
          console.error("category delete failed:", err);
        }
      },
      invalidatesTags: ["Category"],
    }),

    exportToCsv: builder.query({
      query: () => ({
        url: "/product/export/csv/",
        method: "GET",
        responseHandler: (response) => response.blob(), // Treat the response as a Blob
      }),
    }),
    confirmPayment: builder.mutation({
      query: (orderId) => ({
        url: `/order/confirm-payment/${orderId}`,
        method: "POST",
        // body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Order", "OrderID"],
    }),

    confirmOrder: builder.mutation({
      query: ({ credentials, orderId }) => {
        const queryOptions = {
          url: `/order/${orderId}`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };

        // Add the body only if credentials are provided
        if (credentials) {
          queryOptions.body = credentials;
        }

        return queryOptions;
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Order confirmation failed:", err);
        }
      },
      invalidatesTags: ["Order", "OrderID"],
    }),

    getChart: builder.query({
      query: () => "/order/stats/chart",
      headers: { "Content-Type": "application/json" },
    }),

    getSummary: builder.query({
      query: () => "/order/stats/summary",
      headers: { "Content-Type": "application/json" },
    }),

    getDrivers: builder.query({
      query: () => "/driver/all-drivers",
      providesTags: ["Driver"],
      headers: { "Content-Type": "application/json" },
    }),

    createDriver: builder.mutation({
      query: (credentials) => ({
        url: "/driver/create",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Driver"],
    }),

    editDriver: builder.mutation({
      query: ({ credentials, driverId }) => ({
        url: `/driver/${driverId}`,
        method: "PATCH",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
      invalidatesTags: ["Driver"],
    }),

    deleteDriver: builder.mutation({
      query: (id) => ({
        url: `/driver/${id}`,
        method: "DELETE",
        // body: formData,
      }),

      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          // console.log("registered");
          await queryFulfilled;
        } catch (err) {
          console.error("category delete failed:", err);
        }
      },
      invalidatesTags: ["Driver"],
    }),

    createContact: builder.mutation({
      query: (credentials) => ({
        url: `/contact/create-contact`,
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    createNewsletter: builder.mutation({
      query: (credentials) => ({
        url: `/newsletter/create-newsletter`,
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    createAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/create-admin",
        method: "POST",
        body: credentials,
        // headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Register failed:", err);
        }
      },
    }),

    getGoogleSignin: builder.query({
      query: () => "/google",
      // headers: { "Content-Type": "application/json" },
    }),

    // ==================== BATCH ENDPOINTS ====================
    createBatch: builder.mutation({
      query: (credentials) => ({
        url: "/batch/create",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Batch creation failed:", err);
        }
      },
      invalidatesTags: ["Batch"],
    }),

    getAllBatches: builder.query({
      query: ({ page = 1, limit = 10, status, productId } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);
        if (productId) params.append("productId", productId);
        return `/batch?${params.toString()}`;
      },
      providesTags: ["Batch"],
      headers: { "Content-Type": "application/json" },
    }),

    getBatchById: builder.query({
      query: (batchId) => `/batch/${batchId}`,
      headers: { "Content-Type": "application/json" },
    }),

    updateBatchQuantity: builder.mutation({
      query: ({ batchId, quantityAvailable }) => ({
        url: `/batch/${batchId}/quantity`,
        method: "PATCH",
        body: { quantityAvailable },
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Batch quantity update failed:", err);
        }
      },
      invalidatesTags: ["Batch"],
    }),

    getBatchesByStatus: builder.query({
      query: (status) => `/batch/status/${status}`,
      headers: { "Content-Type": "application/json" },
    }),

    // ==================== ALERT ENDPOINTS ====================
    getAllAlerts: builder.query({
      query: ({ acknowledged, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (acknowledged !== undefined) params.append("acknowledged", acknowledged);
        return `/alert?${params.toString()}`;
      },
      providesTags: ["Alert"],
      headers: { "Content-Type": "application/json" },
    }),

    getOpenAlerts: builder.query({
      query: () => "/alert/open",
      providesTags: ["Alert"],
      headers: { "Content-Type": "application/json" },
    }),

    getAlertById: builder.query({
      query: (alertId) => `/alert/${alertId}`,
      headers: { "Content-Type": "application/json" },
    }),

    acknowledgeAlert: builder.mutation({
      query: ({ alertId, acknowledgedBy }) => ({
        url: `/alert/${alertId}/acknowledge`,
        method: "PATCH",
        body: { acknowledgedBy },
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Alert acknowledgement failed:", err);
        }
      },
      invalidatesTags: ["Alert"],
    }),

    getAlertsByBatch: builder.query({
      query: (batchId) => `/alert/batch/${batchId}`,
      headers: { "Content-Type": "application/json" },
    }),

    // ==================== ALERT RULE ENDPOINTS ====================
    createAlertRule: builder.mutation({
      query: (credentials) => ({
        url: "/alert-rule/create",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Alert rule creation failed:", err);
        }
      },
      invalidatesTags: ["AlertRule"],
    }),

    getAllAlertRules: builder.query({
      query: ({ active } = {}) => {
        const params = new URLSearchParams();
        if (active !== undefined) params.append("active", active);
        return `/alert-rule?${params.toString()}`;
      },
      providesTags: ["AlertRule"],
      headers: { "Content-Type": "application/json" },
    }),

    getDefaultAlertRule: builder.query({
      query: () => "/alert-rule/default",
      headers: { "Content-Type": "application/json" },
    }),

    getAlertRuleById: builder.query({
      query: (ruleId) => `/alert-rule/${ruleId}`,
      headers: { "Content-Type": "application/json" },
    }),

    updateAlertRule: builder.mutation({
      query: ({ ruleId, credentials }) => ({
        url: `/alert-rule/${ruleId}`,
        method: "PATCH",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Alert rule update failed:", err);
        }
      },
      invalidatesTags: ["AlertRule"],
    }),

    deleteAlertRule: builder.mutation({
      query: (ruleId) => ({
        url: `/alert-rule/${ruleId}`,
        method: "DELETE",
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Alert rule deletion failed:", err);
        }
      },
      invalidatesTags: ["AlertRule"],
    }),

    // ==================== ACTION ENDPOINTS ====================
    logAction: builder.mutation({
      query: (credentials) => ({
        url: "/action/log",
        method: "POST",
        body: credentials,
        headers: { "Content-Type": "application/json" },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Action logging failed:", err);
        }
      },
      invalidatesTags: ["Action", "Batch"],
    }),

    getAllActions: builder.query({
      query: ({ page = 1, limit = 10, batchId } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (batchId) params.append("batchId", batchId);
        return `/action?${params.toString()}`;
      },
      providesTags: ["Action"],
      headers: { "Content-Type": "application/json" },
    }),

    getActionById: builder.query({
      query: (actionId) => `/action/${actionId}`,
      headers: { "Content-Type": "application/json" },
    }),

    getActionsByBatch: builder.query({
      query: (batchId) => `/action/batch/${batchId}`,
      headers: { "Content-Type": "application/json" },
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyTokenMutation,
  useResendVerifyTokenMutation,
  useLoginMutation,
  useLostPasswordMutation,
  useChangePasswordMutation,
  useVerifyPasswordLinkMutation,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetAllUserOrdersQuery,
  useGetUserOrderByIdQuery,
  useUpdateProfileMutation,
  useToggleStockMutation,
  useIsHotMutation,
  useBestSellerMutation,
  useDeleteCategoryMutation,

  useDeleteProductMutation,

  useGetAllCategoryQuery,
  useGetCategoryByIdQuery,
  useLazySearchQuery,

  useGetAllProductQuery,
  useLazyExportToCsvQuery,

  useGetProductByIdQuery,
  useGetAllOrdersQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useConfirmPaymentMutation,
  useConfirmOrderMutation,

  useCreateCategoryMutation,
  useEditCategoryMutation,
  useGetChartQuery,
  useGetSummaryQuery,
  useCreateContactMutation,
  useCreateNewsletterMutation,
  useCreateAdminMutation,

  useGetDriversQuery,
  useCreateDriverMutation,
  useEditDriverMutation,
  useDeleteDriverMutation,

  useGetGoogleSigninQuery,

  // Batch exports
  useCreateBatchMutation,
  useGetAllBatchesQuery,
  useGetBatchByIdQuery,
  useUpdateBatchQuantityMutation,
  useGetBatchesByStatusQuery,

  // Alert exports
  useGetAllAlertsQuery,
  useGetOpenAlertsQuery,
  useGetAlertByIdQuery,
  useAcknowledgeAlertMutation,
  useGetAlertsByBatchQuery,

  // Alert Rule exports
  useCreateAlertRuleMutation,
  useGetAllAlertRulesQuery,
  useGetDefaultAlertRuleQuery,
  useGetAlertRuleByIdQuery,
  useUpdateAlertRuleMutation,
  useDeleteAlertRuleMutation,

  // Action exports
  useLogActionMutation,
  useGetAllActionsQuery,
  useGetActionByIdQuery,
  useGetActionsByBatchQuery,
} = productsApi;
