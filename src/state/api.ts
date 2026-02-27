import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, Job, InspectionForm ,CancelReason, RestartReason} from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:3000';

interface BackendResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

export interface LoginPayload {
  username: string;
  password: string;
}
export interface LoginResponse extends BackendResponse<User> {}
export interface MeResponse extends BackendResponse<User> {}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['User', 'Jobs', 'Job'],
  endpoints: (builder) => ({

    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<BackendResponse<void>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    verifyTokens: builder.mutation<
      { isAccessTokenValid: boolean; isRefreshTokenValid: boolean },
      { accessToken: string; refreshToken: string }
    >({
      query: (tokens) => ({
        url: '/auth/verify-tokens',
        method: 'POST',
        body: tokens,
      }),
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => '/user/me',
      providesTags: ['User'],
    }),

    getJobs: builder.query<BackendResponse<Job[]>, void>({
      query: () => '/jobs',
      providesTags: ['Jobs'],
    }),

    getJobHistory: builder.query<BackendResponse<Job[]>, void>({
      query: () => '/jobs/history',
      providesTags: ['Jobs'],
    }),

    getJobById: builder.query<BackendResponse<Job>, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    updateJobStatus: builder.mutation<BackendResponse<Job>, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/jobs/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }, 'Jobs'],
    }),

    verifySerialNumber: builder.mutation<
      BackendResponse<{ success: boolean }>,
      { jobId: string; productId: string; sn: string }
    >({
      query: ({ jobId, productId, sn }) => ({
        url: `/jobs/${jobId}/pickup/verify`,
        method: 'POST',
        body: { productId, sn },
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }],
    }),

    confirmPickup: builder.mutation<BackendResponse<Job>, { jobId: string }>({
      query: ({ jobId }) => ({
        url: `/jobs/${jobId}/pickup/confirm`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    }),

    arrivedAtStore: builder.mutation<BackendResponse<Job>, { jobId: string }>({
      query: ({ jobId }) => ({
        url: `/jobs/${jobId}/arrived`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    }),

    cancelJob: builder.mutation<
      BackendResponse<Job>,
      { jobId: string; reason: CancelReason; note?: string }
    >({
      query: ({ jobId, ...body }) => ({
        url: `/jobs/${jobId}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    }),

    submitInspectionForm: builder.mutation<
      BackendResponse<{ success: boolean }>,
      { jobId: string; itemId: string; form: Omit<InspectionForm, 'productId' | 'productName'> }
    >({
      query: ({ jobId, itemId, form }) => ({
        url: `/jobs/${jobId}/install/${itemId}`,
        method: 'POST',
        body: form,
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }],
    }),

    submitSignOff: builder.mutation<
      BackendResponse<Job>,
      { jobId: string; signature: string; receiverName: string }
    >({
      query: ({ jobId, signature, receiverName }) => ({
        url: `/jobs/${jobId}/sign`,
        method: 'POST',
        body: { signature, receiverName },
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    }),

    restartJob: builder.mutation<
      BackendResponse<Job>,
      { jobId: string; reason: RestartReason; note?: string }
    >({
      query: ({ jobId, ...body }) => ({
        url: `/jobs/${jobId}/restart`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyTokensMutation,
  useGetMeQuery,
  useGetJobsQuery,
  useGetJobHistoryQuery,
  useGetJobByIdQuery,
  useUpdateJobStatusMutation,
  useVerifySerialNumberMutation,
  useConfirmPickupMutation,
  useArrivedAtStoreMutation,
  useCancelJobMutation,
  useSubmitInspectionFormMutation,
  useSubmitSignOffMutation,
  useRestartJobMutation,
} = api;