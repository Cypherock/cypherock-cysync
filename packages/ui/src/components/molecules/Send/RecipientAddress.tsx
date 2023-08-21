import React from 'react';
import styled from 'styled-components';

import { QrCode } from '../../../assets';
import { Button, Flex, Input, Throbber, Typography } from '../../atoms';

interface RecipientAddressProps {
  text?: string;
  placeholder: string;
  error?: string;
  deleteButton?: boolean;
  onDelete?: () => void;
  value: string;
  onChange: (val: string) => void;
  isThrobberActive?: boolean;
  showError?: boolean;
  index?: number;
  length?: number;
}

const RecipientAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

export const MiniButton = styled(Button)`
  width: 14px;
  height: 14px;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.background.toggleActive};
`;

const Numbering = styled.div`
  display: flex;
  width: var(--16-px, 16px);
  height: var(--16-px, 16px);
  padding: 1px 3px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.silver};
`;

export const RecipientAddress: React.FC<RecipientAddressProps> = ({
  text = '',
  placeholder = '',
  error = '',
  deleteButton = false,
  onDelete,
  value,
  length = 0,
  index = 0,
  onChange,
  isThrobberActive,
  showError,
}) => {
  const throbber = <Throbber size={15} strokeWidth={2} />;
  const image = <QrCode width="25px" height="20px" />;
  const postfixIcon = isThrobberActive ? throbber : image;

  return (
    <RecipientAddressContainer>
      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          {deleteButton && (
            <Numbering>
              <Typography $fontSize={10} $fontWeight="bold" color="black">
                {index + 1}
              </Typography>
            </Numbering>
          )}
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            {text}
          </Typography>
        </Flex>
        {deleteButton && length > 2 && (
          <MiniButton onClick={onDelete}>-</MiniButton>
        )}
        {deleteButton && length <= 2 && (
          <MiniButton disabled onClick={onDelete}>
            -
          </MiniButton>
        )}
      </Flex>
      <Input
        type="text"
        name="address"
        placeholder={placeholder}
        postfixIcon={postfixIcon}
        value={value}
        onChange={onChange}
        $textColor="white"
        $error={showError}
      />
      {error && (
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
  showError: false,
  onDelete: undefined,
  isThrobberActive: false,
  index: 0,
  length: 0,
};
