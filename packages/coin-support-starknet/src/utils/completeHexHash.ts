const removeHexPrefix = (hex: string) => hex.replace(/^0x/i, '');

export const completeHexHash = (input: string, maxLength = 64) =>
  `0x${removeHexPrefix(input).padStart(maxLength, '0')}`;
