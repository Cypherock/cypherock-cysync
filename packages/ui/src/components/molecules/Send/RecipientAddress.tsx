import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { qrCodeIcon } from '../../../assets';
import {
  Flex,
  Image,
  InputWithDynamicPostfix,
  MiniButton,
  Throbber,
  Typography,
} from '../../atoms';

interface RecipientAddressProps {
  text?: string;
  placeholder: string;
  error?: string;
  deleteButton?: boolean;
  onDelete?: () => void;
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
}) => {
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [showError, setShowError] = useState(false);

  const throbber: JSX.Element = <Throbber size={15} strokeWidth={2} />;
  const image: JSX.Element = (
    <Image src={qrCodeIcon} alt="qr icon" width={25} height={20} />
  );
  const [postfixIcon, setPostfixIcon] = useState(image);

  const handleInputValueChange = (val: string) => {
    if (val.trim() === 'hello') {
      setShowError(true);
    } else {
      setShowError(false);
    }
    setIsInputChanged(val.trim() !== '');
  };

  useEffect(() => {
    if (isInputChanged) {
      setPostfixIcon(throbber);
      setTimeout(() => {
        setPostfixIcon(image);
      }, 2000);
    } else {
      setPostfixIcon(image);
    }
  }, [isInputChanged]);

  return (
    <RecipientAddressContainer>
      <Flex justify="space-between" align="center" width="full">
        <Typography variant="span" width="100%" color="muted" $fontSize={13}>
          {text}
        </Typography>
        {deleteButton && <MiniButton onClick={onDelete} />}
      </Flex>
      <InputWithDynamicPostfix
        postfixIcon={postfixIcon}
        onChange={handleInputValueChange}
        text={placeholder}
        throbber={throbber}
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
};
