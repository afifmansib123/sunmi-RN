import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, Job, InspectionForm, CancelReason, RestartReason } from '../types';

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

    // ── AUTH ──────────────────────────────────────────────────────────────────

    // POST /auth/login  { username, password }
    // Sets httpOnly accessToken + refreshToken cookies on success
    // login: builder.mutation<LoginResponse, LoginPayload>({
    //   query: (credentials) => ({
    //     url: '/auth/login',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    //   invalidatesTags: ['User'],
    // }),

    // POST /auth/logout — clears cookies server-side
    // logout: builder.mutation<BackendResponse<void>, void>({
    //   query: () => ({
    //     url: '/auth/logout',
    //     method: 'POST',
    //   }),
    //   invalidatesTags: ['User'],
    // }),

    // POST /auth/verify-tokens  { accessToken, refreshToken }
    // Returns: { isAccessTokenValid: boolean, isRefreshTokenValid: boolean }
    // verifyTokens: builder.mutation
    //   { isAccessTokenValid: boolean; isRefreshTokenValid: boolean },
    //   { accessToken: string; refreshToken: string }
    // >({
    //   query: (tokens) => ({
    //     url: '/auth/verify-tokens',
    //     method: 'POST',
    //     body: tokens,
    //   }),
    // }),

    // ── USER ──────────────────────────────────────────────────────────────────

    // GET /user/me  (requires auth cookie)
    // getMe: builder.query<MeResponse, void>({
    //   query: () => '/user/me',
    //   providesTags: ['User'],
    // }),

    // ── JOBS ──────────────────────────────────────────────────────────────────

    // GET /jobs
    // getJobs: builder.query<BackendResponse<Job[]>, void>({
    //   query: () => '/jobs',
    //   providesTags: ['Jobs'],
    // }),

    // GET /jobs/history
    // getJobHistory: builder.query<BackendResponse<Job[]>, void>({
    //   query: () => '/jobs/history',
    //   providesTags: ['Jobs'],
    // }),

    // GET /jobs/:id
    // getJobById: builder.query<BackendResponse<Job>, string>({
    //   query: (id) => `/jobs/${id}`,
    //   providesTags: (result, error, id) => [{ type: 'Job', id }],
    // }),

    // PATCH /jobs/:id/status
    // updateJobStatus: builder.mutation<BackendResponse<Job>, { id: string; status: string }>({
    //   query: ({ id, status }) => ({
    //     url: `/jobs/${id}/status`,
    //     method: 'PATCH',
    //     body: { status },
    //   }),
    //   invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }, 'Jobs'],
    // }),

    // ── PICKUP ────────────────────────────────────────────────────────────────

    // POST /jobs/:jobId/pickup/verify — verify a single SN
    // verifySerialNumber: builder.mutation
    //   BackendResponse<{ success: boolean }>,
    //   { jobId: string; productId: string; sn: string }
    // >({
    //   query: ({ jobId, productId, sn }) => ({
    //     url: `/jobs/${jobId}/pickup/verify`,
    //     method: 'POST',
    //     body: { productId, sn },
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }],
    // }),

    // POST /jobs/:jobId/pickup/confirm — all SNs verified, confirm pickup
    // confirmPickup: builder.mutation<BackendResponse<Job>, { jobId: string }>({
    //   query: ({ jobId }) => ({
    //     url: `/jobs/${jobId}/pickup/confirm`,
    //     method: 'POST',
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    // }),

    // ── IN-TRANSIT ────────────────────────────────────────────────────────────

    // POST /jobs/:jobId/arrived — driver arrived at store
    // arrivedAtStore: builder.mutation<BackendResponse<Job>, { jobId: string }>({
    //   query: ({ jobId }) => ({
    //     url: `/jobs/${jobId}/arrived`,
    //     method: 'POST',
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    // }),

    // POST /jobs/:jobId/cancel
    // cancelJob: builder.mutation
    //   BackendResponse<Job>,
    //   { jobId: string; reason: CancelReason; note?: string }
    // >({
    //   query: ({ jobId, ...body }) => ({
    //     url: `/jobs/${jobId}/cancel`,
    //     method: 'POST',
    //     body,
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    // }),

    // ── INSTALL ───────────────────────────────────────────────────────────────

    // POST /jobs/:jobId/install/:itemId — submit inspection form for one SN
    // submitInspectionForm: builder.mutation
    //   BackendResponse<{ success: boolean }>,
    //   { jobId: string; itemId: string; form: Omit<InspectionForm, 'productId' | 'productName'> }
    // >({
    //   query: ({ jobId, itemId, form }) => ({
    //     url: `/jobs/${jobId}/install/${itemId}`,
    //     method: 'POST',
    //     body: form,
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }],
    // }),

    // ── SIGN-OFF ──────────────────────────────────────────────────────────────

    // POST /jobs/:jobId/sign — customer signature + receiver name
    // submitSignOff: builder.mutation
    //   BackendResponse<Job>,
    //   { jobId: string; signature: string; receiverName: string }
    // >({
    //   query: ({ jobId, signature, receiverName }) => ({
    //     url: `/jobs/${jobId}/sign`,
    //     method: 'POST',
    //     body: { signature, receiverName },
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    // }),

    // ── RESTART ───────────────────────────────────────────────────────────────

    // POST /jobs/:jobId/restart
    // restartJob: builder.mutation
    //   BackendResponse<Job>,
    //   { jobId: string; reason: RestartReason; note?: string }
    // >({
    //   query: ({ jobId, ...body }) => ({
    //     url: `/jobs/${jobId}/restart`,
    //     method: 'POST',
    //     body,
    //   }),
    //   invalidatesTags: (result, error, { jobId }) => [{ type: 'Job', id: jobId }, 'Jobs'],
    // }),
  }),
});

export const {
  // useLoginMutation,
  // useLogoutMutation,
  // useVerifyTokensMutation,
  // useGetMeQuery,
  // useGetJobsQuery,
  // useGetJobHistoryQuery,
  // useGetJobByIdQuery,
  // useUpdateJobStatusMutation,
  // useVerifySerialNumberMutation,
  // useConfirmPickupMutation,
  // useArrivedAtStoreMutation,
  // useCancelJobMutation,
  // useSubmitInspectionFormMutation,
  // useSubmitSignOffMutation,
  // useRestartJobMutation,
} = api;