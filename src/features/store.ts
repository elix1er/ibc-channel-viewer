import { configureStore } from '@reduxjs/toolkit';

import chainRegistryReducer from './chainRegistry/chainRegistrySlice';
import ibcInfoReducer from './ibcInfo/ibcInfoSlice';

export const store = configureStore({
  reducer: {
    ibcInfo: ibcInfoReducer,
    chainRegistry: chainRegistryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
