const HASH_LENGTH = 64; // 32 BYTES

const removeHexPrefix = (hex: string) => hex.replace(/^0x/i, '');

export const completeHexHash = (hex: string) => {
  const inputHexHash = removeHexPrefix(hex);
  let remainingChars = HASH_LENGTH - inputHexHash.length;

  let hexPrefix = '0x';
  while (remainingChars) {
    hexPrefix += '0';
    remainingChars -= 1;
  }

  return `${hexPrefix}${inputHexHash}`;
};
