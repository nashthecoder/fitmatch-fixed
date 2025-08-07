import { configureStore } from '@reduxjs/toolkit';

// Minimal store configuration
const store = configureStore({
  reducer: {
    auth: (state = { user: null, creatingUserData: false }, action) => {
      switch (action.type) {
        case 'SET_USER':
          return { ...state, user: action.payload };
        case 'SET_CREATING':
          return { ...state, creatingUserData: action.payload };
        default:
          return state;
      }
    }
  }
});

export const persistor = { purge: () => Promise.resolve() };
export { store };