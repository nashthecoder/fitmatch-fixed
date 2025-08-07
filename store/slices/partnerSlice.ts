import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PartnerData {
  id: string;
  name: string;
  titre: string;
  description: string;
  logoURL?: string;
  imageUrl?: string;
  images?: string[];
  videos?: string[];
  numero?: string;
  adresse?: string;
  siteWeb?: string;
  categorie?: string;
  // Add other partner properties as needed
}

interface PartnerState {
  data: PartnerData;
  partners: PartnerData[];
  loading: boolean;
  error: string | null;
}

const initialState: PartnerState = {
  data: {
    id: '',
    name: '',
    titre: '',
    description: '',
    categorie: '',
  },
  partners: [],
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setPartnerData: (state, action: PayloadAction<PartnerData>) => {
      state.data = action.payload;
    },
    updatePartnerField: (state, action: PayloadAction<{ field: keyof PartnerData; value: any }>) => {
      const { field, value } = action.payload;
      (state.data as any)[field] = value;
    },
    setPartners: (state, action: PayloadAction<PartnerData[]>) => {
      state.partners = action.payload;
    },
    setPartnerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPartnerError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPartnerImages: (state, action: PayloadAction<string[]>) => {
      state.data.images = action.payload;
    },
    setPartnerVideos: (state, action: PayloadAction<string[]>) => {
      state.data.videos = action.payload;
    },
    resetPartnerData: (state) => {
      state.data = initialState.data;
    },
  },
});

export const { 
  setPartnerData,
  updatePartnerField,
  setPartners, 
  setPartnerLoading, 
  setPartnerError,
  setPartnerImages,
  setPartnerVideos,
  resetPartnerData
} = partnerSlice.actions;
export default partnerSlice.reducer;