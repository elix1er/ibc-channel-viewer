import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ToastProvider, useToast } from 'tw-noti';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import {
  fetchChannels,
  fetchIBCData,
  setChannelId,
  setRestAddress,
  setShowTransferOnly,
} from '../../features/ibcInfo/ibcInfoSlice';
import { AppDispatch, RootState } from '../../features/store';
import LoadingBorderCard from '../ui/loading-border-card';
import ChainRestSelector from './ChainRestSelector';

// import ChainRestSelector from './registry';

const IBCInfoFetcher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueToast } = useToast();

  const { restAddress, channelId, isLoading, error, availableChannels, showTransferOnly } = useSelector(
    (state: RootState) => state.ibcInfo,
  );
  const { selectedEndpoint } = useSelector((state: RootState) => state.chainRegistry);

  useEffect(() => {
    if (error) {
      enqueueToast({ content: error, type: 'error' });
    }
  }, [error, enqueueToast]);

  useEffect(() => {
    if (selectedEndpoint) {
      dispatch(setRestAddress(selectedEndpoint));
      dispatch(fetchChannels());
    }
  }, [selectedEndpoint, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fetchIBCData());
  };

  const filteredChannels = showTransferOnly
    ? availableChannels.filter((channel: { port_id: string }) => channel.port_id === 'transfer')
    : availableChannels;

  return (
    <ToastProvider maxToasts={3} timeout={3000} containerClasses="right-12 bottom-12">
      <div className="">
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <LoadingBorderCard isLoading={isLoading}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">IBC Data Explorer</CardTitle>
                <CardDescription>Fetch and explore IBC data</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <ChainRestSelector disabled={isLoading || Boolean(error)} />
                    <div className="space-y-2">
                      <Label htmlFor="channelId">Channel ID</Label>
                      <Select
                        disabled={isLoading || !restAddress || !availableChannels.length || Boolean(error)}
                        value={channelId}
                        onValueChange={value => dispatch(setChannelId(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredChannels.map(channel => (
                            <SelectItem key={channel.channel_id} value={channel.channel_id}>
                              {channel.channel_id} (
                              {channel.port_id.length > 42
                                ? `${channel.port_id.substring(0, 14)}...${channel.port_id.slice(-4)}`
                                : channel.port_id}
                              )
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="channel-type"
                      checked={showTransferOnly}
                      onCheckedChange={checked => dispatch(setShowTransferOnly(checked))}
                    />
                    <Label htmlFor="channel-type">Show Transfer Channels Only</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || !channelId}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching Data
                      </>
                    ) : (
                      'Fetch IBC Data'
                    )}
                  </Button>
                </form>
              </CardContent>
            </LoadingBorderCard>
          </motion.div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default IBCInfoFetcher;
