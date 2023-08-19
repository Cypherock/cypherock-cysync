import React from 'react';
import { BitcoinInput } from './BitcoinInput';
import { EthereumInput } from './EthereumInput';
import { Caption } from '@cypherock/cysync-ui';

interface RecipientInputProps {
  type: 'slider' | 'input';
  message: string;
  inputValue: string;
  inputPostfix: string;
  value: number;
  onChange: (newValue: number) => void;
  Captions: Caption[];
  error: string;
  coin?: 'bitcoin' | 'ethereum';
  feesError: string;
  gas?: string;
  limit?: string;
}

export const RecipientInput: React.FC<RecipientInputProps> = ({
  type,
  message,
  inputValue,
  inputPostfix,
  value,
  onChange,
  Captions,
  error,
  coin = 'bitcoin',
  feesError,
  gas = '',
  limit = '',
}) =>
  coin === 'bitcoin' ? (
    <BitcoinInput
      type={type}
      message={message}
      inputValue={inputValue}
      inputPostfix={inputPostfix}
      value={value}
      onChange={onChange}
      captions={Captions}
      error={feesError}
    />
  ) : (
    <EthereumInput
      type={type}
      message={message}
      inputValue={inputValue}
      inputPostfix={inputPostfix}
      gas={gas}
      limit={limit}
      value={value}
      onChange={onChange}
      captions={Captions}
      error={error}
    />
  );

RecipientInput.defaultProps = {
  gas: '',
  limit: '',
  coin: 'bitcoin',
};
