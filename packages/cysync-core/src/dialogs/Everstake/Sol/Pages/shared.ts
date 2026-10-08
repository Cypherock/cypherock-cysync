import React from 'react';

export const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
  maxHeight: '80vh',
  overflowY: 'auto',
};

export const CENTERED_CARD_STYLE: React.CSSProperties = {
  ...CARD_STYLE,
  alignItems: 'center',
  maxHeight: undefined,
  overflowY: undefined,
};

export const INFO_BOX_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  padding: 16,
};

export const INFO_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  alignItems: 'flex-start',
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  padding: '14px 16px',
};

export const INFO_NOTE_STYLE: React.CSSProperties = {
  background: 'rgba(196,146,42,0.08)',
  border: '1px solid rgba(196,146,42,0.2)',
  borderRadius: 8,
  padding: '10px 14px',
};

export const CLAIMABLE_BOX_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  background: 'rgba(76,175,125,0.08)',
  border: '1px solid rgba(76,175,125,0.2)',
  borderRadius: 10,
  padding: '14px 18px',
};

export const STAKE_PERCENTAGE_OPTIONS = [25, 50, 75];

export const MAX_INTEGER_DIGITS = 15;
export const MAX_TOKEN_DECIMALS = 9; // lamports precision
export const MAX_USD_DECIMALS = 2;

export const sanitizeAmountInput = (
  val: string,
  maxDecimals: number,
): string => {
  const cleaned = val.replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned.slice(0, MAX_INTEGER_DIGITS);
  const intPart = cleaned.slice(0, firstDot).slice(0, MAX_INTEGER_DIGITS);
  const decPart = cleaned
    .slice(firstDot + 1)
    .replace(/\./g, '')
    .slice(0, maxDecimals);
  return `${intPart}.${decPart}`;
};

export const SOL_LEARN_MORE_URL = 'https://everstake.one/solana';
export const getSolscanTxUrl = (hash: string) =>
  `https://solscan.io/tx/${hash}`;
