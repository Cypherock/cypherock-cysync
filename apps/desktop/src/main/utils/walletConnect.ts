let walletConnectUri: string | null;

export const setWCUri = (uri: typeof walletConnectUri) => {
  walletConnectUri = uri;
};
export const getWCUri = () => walletConnectUri;
