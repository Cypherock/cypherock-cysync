let walletConnectUri: string | undefined;

export const setWCUri = (uri: typeof walletConnectUri) => {
  walletConnectUri = uri;
};
export const getWCUri = () => walletConnectUri;
