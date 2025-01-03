const removeHexPrefix = (hex: string) => hex.replace(/^0x/i, '');

export const addHexPrefix = (hex: string) => {
  let hexPrefix = '0x';
  if (hex.length % 2) hexPrefix = '0x0';

  return `${hexPrefix}${removeHexPrefix(hex)}`;
};
