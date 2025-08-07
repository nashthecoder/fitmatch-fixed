import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PartnerData {
  id: string;
  name: string;
  description: string;
  logoURL?: string;
  // Add other partner properties as needed
}

interface PartnerState {
  partners: PartnerData[];
  loading: boolean;
  error: string | null;
}

const initialState: PartnerState = {
  partners: [],
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setPartners: (state, action: PayloadAction<PartnerData[]>) => {
      state.partners = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPartners, setLoading, setError } = partnerSlice.actions;
export default partnerSlice.reducer;