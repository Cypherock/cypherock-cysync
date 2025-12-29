export const paymentMethodIcons: Record<string, string> = {
  card: '💳',
  gbp_bank_transfer: '🇬🇧',
  sepa_bank_transfer: '🇪🇺',
  pix: '🇧🇷',
  pay_id: '🇦🇺',
  ach: '🏦',
  DCINTERAC: '🇨🇦',
};

export const getPaymentMethodIcon = (code: string): string | undefined =>
  paymentMethodIcons[code];
