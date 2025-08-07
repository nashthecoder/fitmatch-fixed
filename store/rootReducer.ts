import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import partnerSlice from './slices/partnerSlice';

export const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  partner: partnerSlice,
});

export type RootState = ReturnType<typeof rootReducer>;
