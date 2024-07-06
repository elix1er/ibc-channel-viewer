/* eslint-disable import/no-extraneous-dependencies */

import { ChainRegistryClient } from '@chain-registry/client';
import type { AssetList, Chain } from '@chain-registry/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit/react';
import { chains } from 'chain-registry';

interface ChainRegistryState {
  chains: Chain[];
  assetLists: AssetList[];
  selectedChain: string;
  restEndpoints: string[];
  selectedEndpoint: string;
}

const initialState: ChainRegistryState = {
  chains: [],
  assetLists: [],
  selectedChain: '',
  restEndpoints: [],
  selectedEndpoint: '',
};

export const initializeChainRegistry = createAsyncThunk('chainRegistry/initialize', async () => {
  const client = new ChainRegistryClient({
    chainNames: ['juno', 'migaloo', 'osmosis'],
    // 'terra2', 'migaloo', 'juno' // Add more chains as needed
  });
  //   await client.fetchUrls();
  return { chains: chains, assetLists: client.assetLists };
});

interface RestApi {
  address: string;
}

const chainRegistrySlice = createSlice({
  name: 'chainRegistry',
  initialState,
  reducers: {
    setSelectedChain: (state, action: PayloadAction<string>) => {
      state.selectedChain = action.payload;
      const chainData = state.chains.find(chain => chain.chain_name === action.payload);

      if (chainData) {
        const endpoints = (chainData.apis?.rest?.map((api: RestApi) => api.address) || []) as string[];

        state.restEndpoints = [...new Set(endpoints)];
        state.selectedEndpoint = state.restEndpoints[0] || '';
      }
    },
    setSelectedEndpoint: (state, action: PayloadAction<string>) => {
      state.selectedEndpoint = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(initializeChainRegistry.fulfilled, (state, action) => {
      state.chains = action.payload.chains;
      state.assetLists = action.payload.assetLists;
    });
  },
});

export const { setSelectedChain, setSelectedEndpoint } = chainRegistrySlice.actions;

export default chainRegistrySlice.reducer;
