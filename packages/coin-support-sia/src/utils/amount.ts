export function scToHastings(sc: string): string {
  if (!sc || sc === '0' || sc === '') {
    return '0';
  }

  // Split on decimal point
  const parts = sc.split('.');
  const wholePart = parts[0] || '0';
  const decimalPart = (parts[1] || '').padEnd(24, '0').substring(0, 24);

  // Convert using BigInt to avoid precision loss
  const wholeHastings = BigInt(wholePart) * BigInt('1000000000000000000000000');
  const decimalHastings = BigInt(decimalPart);

  return (wholeHastings + decimalHastings).toString();
}

export function hastingsToSC(hastings: string): string {
  if (!hastings || hastings === '0' || hastings === '') {
    return '0';
  }

  const hastingsBigInt = BigInt(hastings);
  const scWhole = hastingsBigInt / BigInt('1000000000000000000000000');
  const scRemainder = hastingsBigInt % BigInt('1000000000000000000000000');

  // Format decimal part, removing trailing zeros
  const scDecimal =
    scRemainder.toString().padStart(24, '0').replace(/0+$/, '') || '0';

  if (scDecimal === '0') {
    return scWhole.toString();
  }

  return `${scWhole.toString()}.${scDecimal}`;
}

export function hexToBytes(hex: string): number[] {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = [];
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.substr(i, 2), 16));
  }
  return bytes;
}
