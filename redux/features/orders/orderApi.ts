import { apiSlice } from "../api/apiSlice";
export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: "get-all-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    getStripePublishAbleKey: builder.query({
      query: () => ({
        url: "payment/stripePublishAbleKey",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    createPaymentIntent: builder.mutation({
      // The server derives the amount from the course price, so we only send the id.
      query: (courseId) => ({
        url: "payment/process",
        method: "POST",
        body: { courseId },
        credentials: "include" as const,
      }),
    }),

    createOrder: builder.mutation({
      query: ({ courseId, payment_info, userId }) => ({
        url: "create-order",
        method: "POST",
        body: { courseId, payment_info, userId },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  useGetStripePublishAbleKeyQuery,
} = orderApi;