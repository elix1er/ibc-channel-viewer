/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';

import { ChainRegistryClient } from '@chain-registry/client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ChainRestSelector = ({
  onEndpointChange,
  disabled,
}: {
  onEndpointChange: (endpoint: string) => void;
  disabled: boolean;
}) => {
  const [client, setClient] = useState<ChainRegistryClient | null>(null);
  const [chains, setChains] = useState<any[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [restEndpoints, setRestEndpoints] = useState<string[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('');
  const newClient = new ChainRegistryClient({
    // chainNames: ['migaloo'],
    chainNames: ['migaloo', 'osmosis', 'juno'], // Add more chains as needed
  });

  useEffect(() => {
    const initializeClient = async () => {
      await newClient.fetchUrls();
      setClient(newClient);
      setChains(newClient.chains);
    };

    initializeClient();
  }, []);

  useEffect(() => {
    if (selectedChain && client) {
      const chainData = client.getChain(selectedChain);
      const endpoints = chainData.apis?.rest?.map(api => api.address) || [];

      // Filter out duplicate endpoints
      const uniqueEndpoints = [...new Set(endpoints)];

      setRestEndpoints(uniqueEndpoints);
      setSelectedEndpoint(uniqueEndpoints[0] || '');
      onEndpointChange(uniqueEndpoints[0] || '');
    }
  }, [selectedChain, client, onEndpointChange]);

  const handleChainChange = (value: string) => {
    setSelectedChain(value);
  };

  const handleEndpointChange = (value: string) => {
    setSelectedEndpoint(value);
    onEndpointChange(value);
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

      {/* {selectedEndpoint && (
        <div className="pt-4">
          <p className="text-sm font-medium">Selected Endpoint:</p>
          <p className="break-all text-sm">{selectedEndpoint}</p>
        </div>
      )} */}
    </div>
  );
};

export default ChainRestSelector;
