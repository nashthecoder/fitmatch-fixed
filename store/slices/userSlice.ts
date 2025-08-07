import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  profilePicUrl?: string;
  nom?: string;
  prenoms?: string;
  pseudo?: string;
  naissance?: any; // Firestore Timestamp
  ville?: string;
  nationalite?: string;
  sex?: number;
  personalData?: boolean;
  acceptCGU?: boolean;
  mesPhotos?: any[];
  mesVideos?: any[];
  userType?: string;
  // Add other user properties as needed
}

interface UserState {
  currentUser: UserData | null;
  data: UserData | null; // For backward compatibility
  userList: UserData[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  data: null,
  userList: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserData | null>) => {
      state.currentUser = action.payload;
      state.data = action.payload; // For backward compatibility
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.currentUser = action.payload;
      state.data = action.payload; // For backward compatibility
    },
    resetUserData: (state) => {
      state.currentUser = null;
      state.data = null;
    },
    setUserList: (state, action: PayloadAction<UserData[]>) => {
      state.userList = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCurrentUser, setUserData, resetUserData, setUserList, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;