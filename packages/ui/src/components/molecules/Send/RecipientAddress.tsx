import React from 'react';
import styled from 'styled-components';
import {
  Flex,
  Image,
  Input,
  MiniButton,
  Throbber,
  Typography,
} from '../../atoms';
import { qrCodeIcon } from '../../../assets';
import { useRecipientAddress } from '../../hooks';

interface RecipientAddressProps {
  text?: string;
  placeholder: string;
  error?: string;
  deleteButton?: boolean;
  onDelete?: () => void;
  value?: string;
  onChange?: (val: string) => void;
}

const RecipientAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const RecipientAddress: React.FC<RecipientAddressProps> = ({
  text = '',
  placeholder = '',
  error = '',
  deleteButton = false,
  onDelete,
  value = '',
  onChange,
}) => {
  const { inputValue, isThrobberActive, handleInputValueChange, showError } =
    useRecipientAddress(value, onChange);

  const throbber = <Throbber size={15} strokeWidth={2} />;
  const image = <Image src={qrCodeIcon} alt="qr icon" width={25} height={20} />;
  const postfixIcon = isThrobberActive ? throbber : image;

  const handleChange = (val: string) => {
    handleInputValueChange(val);
    if (onChange) onChange(val);
  };

  return (
    <RecipientAddressContainer>
      <Flex justify="space-between" align="center" width="full">
        <Typography variant="span" width="100%" color="muted" $fontSize={13}>
          {text}
        </Typography>
        {deleteButton && <MiniButton onClick={onDelete} />}
      </Flex>
      <Input
        type="text"
        name="address"
        placeholder={placeholder}
        postfixIcon={postfixIcon}
        value={inputValue}
        onChange={handleChange}
        $textColor="white"
      />
      {showError && (
        <Typography
          variant="span"
          width="100%"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          {error}
        </Typography>
      )}
    </RecipientAddressContainer>
  );
};

RecipientAddress.defaultProps = {
  text: 'Recipient Address',
  error: '',
  deleteButton: false,
  onDelete: undefined,
  value: '',
  onChange: undefined,
};
