/* eslint-disable @typescript-eslint/no-explicit-any */

import { RootState } from '@/features/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface IBCData {
//   channelId: string;
//   clientId: string;
//   connectionId: string;
//   counterparty_channelId: string;
//   counterparty_clientId: string;
//   counterparty_connectionId: string;
//   state: string;
//   ordering: string;
//   version: string;
//   portId: string;
// }

interface IBCInfoState {
  restAddress: string;
  channelId: string;
  isLoading: boolean;
  error: string | null;
  data: any | null;
  availableChannels: any[];
  showTransferOnly: boolean;
}

const initialState: IBCInfoState = {
  restAddress: '',
  channelId: '',
  isLoading: false,
  error: null,
  data: null,
  availableChannels: [],
  showTransferOnly: false,
};

export const fetchChannels = createAsyncThunk('ibcInfo/fetchChannels', async (_, { getState, rejectWithValue }) => {
  const { restAddress } = (getState() as RootState).ibcInfo;

  if (!restAddress) return rejectWithValue('REST endpoint is not set');
  const response = await fetch(`${restAddress}/ibc/core/channel/v1/channels`, { mode: 'cors' });
  if (!response.ok) return rejectWithValue('Error fetching channels');

  return response.json();
});

export const fetchIBCData = createAsyncThunk('ibcInfo/fetchIBCData', async (_, { getState, rejectWithValue }) => {
  const { restAddress, channelId, availableChannels } = (getState() as RootState).ibcInfo;

  if (!restAddress) return rejectWithValue('REST endpoint is not set');
  const selectedChannel = availableChannels.find(channel => channel.channel_id === channelId);
  if (!selectedChannel) return rejectWithValue('Selected channel not found');

  let version = '';
  try {
    version = JSON.parse(selectedChannel.version);
  } catch (err) {
    version = selectedChannel.version;
  }

  const result = { ...selectedChannel, version };
  return result;
});

const ibcInfoSlice = createSlice({
  name: 'ibcInfo',
  initialState,
  reducers: {
    setRestAddress: (state, action: PayloadAction<string>) => {
      state.restAddress = action.payload;
    },
    setChannelId: (state, action: PayloadAction<string>) => {
      state.channelId = action.payload;
    },
    setShowTransferOnly: (state, action: PayloadAction<boolean>) => {
      state.showTransferOnly = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChannels.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableChannels = action.payload.channels;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchIBCData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIBCData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchIBCData.rejected, (state, action) => {
        console.log('fetchIBCData.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

export const { setRestAddress, setChannelId, setShowTransferOnly } = ibcInfoSlice.actions;
export default ibcInfoSlice.reducer;
