import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessesReducer from './slices/businessesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businesses: businessesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
