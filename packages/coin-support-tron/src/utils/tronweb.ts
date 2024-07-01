let tronWebInstance: any | undefined;

export const getCoinSupportTronWeb = () => {
  if (!tronWebInstance) {
    throw new Error('tronweb has not been set yet');
  }
  return tronWebInstance;
};

export const setCoinSupportTronWeb = (tronweb: any) => {
  tronWebInstance = tronweb;
};
