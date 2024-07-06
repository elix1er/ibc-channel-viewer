import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { ChainRegistryClient } from '@chain-registry/client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AppDispatch, RootState } from '../../app/store';
import {
  initializeChainRegistry,
  setSelectedChain,
  setSelectedEndpoint,
} from '../../features/chainRegistry/chainRegistrySlice';

const ChainRestSelector = ({ disabled }: { disabled: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chains, selectedChain, restEndpoints, selectedEndpoint } =
    useSelector((state: RootState) => state.chainRegistry);

  useEffect(() => {
    dispatch(initializeChainRegistry());
  }, [dispatch]);

  const handleChainChange = (value: string) => {
    dispatch(setSelectedChain(value));
  };

  const handleEndpointChange = (value: string) => {
    dispatch(setSelectedEndpoint(value));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="chain-select">Select Chain</Label>
        <Select
          onValueChange={handleChainChange}
          value={selectedChain}
          disabled={disabled}
        >
          <SelectTrigger id="chain-select">
            <SelectValue placeholder="Select a chain" />
          </SelectTrigger>
          <SelectContent>
            {chains.map(chain => (
              <SelectItem key={chain.chain_name} value={chain.chain_name}>
                {chain.chain_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedChain && (
        <div className="space-y-2">
          <Label htmlFor="endpoint-select">Select REST Endpoint</Label>
          <Select onValueChange={handleEndpointChange} value={selectedEndpoint}>
            <SelectTrigger id="endpoint-select">
              <SelectValue placeholder="Select an endpoint" />
            </SelectTrigger>
            <SelectContent>
              {restEndpoints.map((endpoint, index) => (
                <SelectItem key={`${endpoint}-${index}`} value={endpoint}>
                  {endpoint}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ChainRestSelector;
