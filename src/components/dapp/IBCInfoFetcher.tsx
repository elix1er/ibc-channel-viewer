import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Editor from '@monaco-editor/react';
import * as Toast from '@radix-ui/react-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { AppDispatch, RootState } from '../../app/store';
import {
  fetchChannels,
  fetchIBCData,
  setChannelId,
  setRestAddress,
  setShowTransferOnly,
} from '../../features/ibcInfo/ibcInfoSlice';
import LoadingBorderCard from '../ui/loading-border-card';
import ChainRestSelector from './registry';

const IBCInfoFetcher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    restAddress,
    channelId,
    isLoading,
    error,
    data,
    availableChannels,
    showTransferOnly,
  } = useSelector((state: RootState) => state.ibcInfo);

  const { selectedEndpoint } = useSelector(
    (state: RootState) => state.chainRegistry,
  );

  const [open, setOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (error) {
      setToastMessage({
        title: 'Error',
        description: error,
      });
      setOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (selectedEndpoint) {
      dispatch(setRestAddress(selectedEndpoint));
    }
  }, [selectedEndpoint, dispatch]);

  useEffect(() => {
    if (restAddress) {
      dispatch(fetchChannels());
    }
  }, [restAddress, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting with channelId:', channelId);
    dispatch(fetchIBCData());
  };

  const filteredChannels = showTransferOnly
    ? availableChannels.filter(
        (channel: { port_id: string }) => channel.port_id === 'transfer',
      )
    : availableChannels;

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Viewport className="fixed right-0 top-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      {/* Header component remains unchanged */}
      <div className="flex min-h-screen w-full items-center justify-center px-12 dark:bg-gray-900">
        <div className="flex w-full max-w-7xl flex-col lg:flex-row lg:space-x-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2"
          >
            <LoadingBorderCard isLoading={isLoading}>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  IBC Info Explorer
                </CardTitle>
                <CardDescription>Fetch and explore IBC data</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <ChainRestSelector disabled={false} />

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="channel-type"
                        checked={showTransferOnly}
                        onCheckedChange={checked =>
                          dispatch(setShowTransferOnly(checked))
                        }
                      />
                      <Label htmlFor="channel-type">
                        Show Transfer Channels Only
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="channelId">Channel ID</Label>
                      <Select
                        disabled={
                          isLoading ||
                          !restAddress ||
                          !availableChannels.length ||
                          Boolean(error)
                        }
                        value={channelId}
                        onValueChange={value => dispatch(setChannelId(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredChannels.map(channel => (
                            <SelectItem
                              key={channel.channel_id}
                              value={channel.channel_id}
                            >
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !channelId}
                  >
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

          <AnimatePresence>
            {data && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="mt-8 w-full lg:mt-0 lg:w-1/2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>IBC Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Editor
                      height="500px"
                      language="json"
                      value={JSON.stringify(data, null, 2)}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        lineNumbers: 'off',
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Toast.Root
        className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="mb-[5px] text-lg font-medium text-slate12 [grid-area:_title]">
          {toastMessage.title}
        </Toast.Title>
        <Toast.Description className="m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]">
          {toastMessage.description}
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Close toast"
        >
          <button className="inline-flex h-[25px] items-center justify-center rounded bg-red-500 px-[10px] text-xs font-medium leading-[25px] text-white shadow-[inset_0_0_0_1px] shadow-red-700 hover:shadow-[inset_0_0_0_1px] hover:shadow-red-800 focus:shadow-[0_0_0_2px] focus:shadow-red-800">
            Close
          </button>
        </Toast.Action>
      </Toast.Root>
    </Toast.Provider>
  );
};

export default IBCInfoFetcher;
