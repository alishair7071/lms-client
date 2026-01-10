import { apiSlice } from "../api/apiSlice";
import { userLoggedOut, userLogin, userRegistration } from "../auth/authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //endpoints here
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userRegistration({ token: result.data.activationToken }));
        } catch (error) {
          console.log("Error occured in registration api", error);
        }
      },
    }),

    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: { activation_token, activation_code },
      }),
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogin({
              token: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("Error occured in registration api", error);
        }
      },
    }),


    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogin({
              token: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("Error occured in registration api", error);
        }
      },
    }),


    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include",
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.log("Error occured in logoutUser api", error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation, useSocialAuthMutation, useLogoutUserMutation } =
  authApi;
