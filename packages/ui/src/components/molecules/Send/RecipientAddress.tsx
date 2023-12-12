import React from 'react';
import styled from 'styled-components';

import { PasteIcon } from '../../..';
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
  index?: number;
  isButtonDisabled?: boolean;
  isDisabled?: boolean;
}

interface CustomInputSendProps {
  error?: string;
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

export const CustomInputSend = styled.div<CustomInputSendProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  align-items: center;
  padding-right: 24px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.palette.border.error : theme.palette.border.separator};
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
`;

export const RecipientAddress: React.FC<RecipientAddressProps> = ({
  text = '',
  placeholder = '',
  error = '',
  deleteButton = false,
  onDelete,
  value,
  isButtonDisabled,
  index = 0,
  onChange,
  isThrobberActive,
  isDisabled,
}) => {
  const throbber = <Throbber size={15} strokeWidth={2} />;
  const handleCopyFromClipboard = async () => {
    const clipboardText = (await navigator.clipboard.readText()).trim();
    onChange(clipboardText);
  };

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
          <Typography variant="span" color="muted" $fontSize={13}>
            {text}
          </Typography>
        </Flex>
        {deleteButton && (
          <MiniButton disabled={isButtonDisabled} onClick={onDelete}>
            -
          </MiniButton>
        )}
      </Flex>
      <CustomInputSend error={error} style={{ paddingRight: 0 }}>
        <Input
          type="text"
          name="address"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          $textColor="white"
          disabled={isDisabled}
          $noBorder
          postfixIcon={isThrobberActive ? throbber : <PasteIcon />}
          onPostfixIconClick={
            isThrobberActive ? undefined : handleCopyFromClipboard
          }
        />
      </CustomInputSend>
      {error && (
        <Typography
          variant="span"
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
  isThrobberActive: false,
  index: 0,
  isButtonDisabled: false,
  isDisabled: false,
};
