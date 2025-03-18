export {};

type RequestArguments = {
  method: string;
  params?: unknown[] | object;
};

type EthereumEventCallback = (params: unknown) => void;

interface EthereumProvider {
  request(args: RequestArguments): Promise<unknown>;
  on(eventName: string, handler: EthereumEventCallback): void;
  removeListener(eventName: string, handler: EthereumEventCallback): void;
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  chainId?: string;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export type { EthereumProvider, RequestArguments, EthereumEventCallback }; 