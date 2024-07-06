import { ChainRegistryClient } from '@chain-registry/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChainRegistryState {
  chains: any[];
  selectedChain: string;
  restEndpoints: string[];
  selectedEndpoint: string;
}

const initialState: ChainRegistryState = {
  chains: [],
  selectedChain: '',
  restEndpoints: [],
  selectedEndpoint: '',
};

export const initializeChainRegistry = createAsyncThunk(
  'chainRegistry/initialize',
  async () => {
    const client = new ChainRegistryClient({
      chainNames: ['migaloo', 'osmosis', 'juno'], // Add more chains as needed
    });

    await client.fetchUrls();

    return client.chains;
  },
);

interface RestApi {
  address: string;
}

const chainRegistrySlice = createSlice({
  name: 'chainRegistry',
  initialState,
  reducers: {
    setSelectedChain: (state, action: PayloadAction<string>) => {
      state.selectedChain = action.payload;
      const chainData = state.chains.find(
        chain => chain.chain_name === action.payload,
      );

      if (chainData) {
        const endpoints = (chainData.apis?.rest?.map(
          (api: RestApi) => api.address,
        ) || []) as string[];

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
      state.chains = action.payload;
    });
  },
});

export const { setSelectedChain, setSelectedEndpoint } =
  chainRegistrySlice.actions;

export default chainRegistrySlice.reducer;
