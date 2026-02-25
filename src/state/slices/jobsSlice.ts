import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job, SerialNumber } from '../../types';
import { mockJobs } from '../../mock/data';

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
}

const initialState: JobsState = {
  jobs: mockJobs,
  selectedJob: null,
};

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    updateJobStatus: (state, action: PayloadAction<{ jobId: string; status: Job['status'] }>) => {
      const job = state.jobs.find((j) => j.id === action.payload.jobId);
      if (job) {
        job.status = action.payload.status;
        if (state.selectedJob?.id === action.payload.jobId) {
          state.selectedJob.status = action.payload.status;
        }
      }
    },
    updateSerialNumber: (
      state,
      action: PayloadAction<{ jobId: string; productId: string; sn: string; verified: boolean }>
    ) => {
      const { jobId, productId, sn, verified } = action.payload;
      const job = state.jobs.find((j) => j.id === jobId);
      if (job) {
        const product = job.products.find((p) => p.id === productId);
        if (product) {
          const snItem = product.serialNumbers.find((s) => s.sn === sn);
          if (snItem) snItem.verified = verified;
        }
        if (state.selectedJob?.id === jobId) {
          const product = state.selectedJob.products.find((p) => p.id === productId);
          if (product) {
            const snItem = product.serialNumbers.find((s) => s.sn === sn);
            if (snItem) snItem.verified = verified;
          }
        }
      }
    },
    markSnInstalled: (
      state,
      action: PayloadAction<{ jobId: string; productId: string; sn: string }>
    ) => {
      const { jobId, productId, sn } = action.payload;
      const job = state.jobs.find((j) => j.id === jobId);
      if (job) {
        const product = job.products.find((p) => p.id === productId);
        if (product) {
          const snItem = product.serialNumbers.find((s) => s.sn === sn);
          if (snItem) snItem.installed = true;
        }
      }
    },
    updateJobSignOff: (
      state,
      action: PayloadAction<{ jobId: string; signature: string; receiverName: string }>
    ) => {
      const { jobId, signature, receiverName } = action.payload;
      const job = state.jobs.find((j) => j.id === jobId);
      if (job) {
        job.customerSignature = signature;
        job.receiverName = receiverName;
        job.status = 'รอลูกค้าเซ็น';
        if (state.selectedJob?.id === jobId) {
          state.selectedJob.customerSignature = signature;
          state.selectedJob.receiverName = receiverName;
        }
      }
    },
  },
});

export const {
  setSelectedJob,
  updateJobStatus,
  updateSerialNumber,
  markSnInstalled,
  updateJobSignOff,
} = jobsSlice.actions;
export default jobsSlice.reducer;
