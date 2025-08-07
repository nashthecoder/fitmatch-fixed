import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { Platform } from 'react-native';
import { rootReducer } from './rootReducer';

// Platform-specific storage implementation
const createStorage = () => {
  if (Platform.OS === 'web') {
    // For web, create localStorage-based storage manually
    return {
      getItem: (key: string) => {
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
    };
  } else {
    // For React Native, try to use AsyncStorage
    try {
      // Dynamic import for AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage'); // eslint-disable-line
      return AsyncStorage.default || AsyncStorage;
    } catch {
      console.warn('AsyncStorage not available, using fallback storage');
      // Fallback storage that doesn't persist
      return {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(),
        removeItem: () => Promise.resolve(),
      };
    }
  }
};

const storage = createStorage();

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth', 'user'], // only these will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;