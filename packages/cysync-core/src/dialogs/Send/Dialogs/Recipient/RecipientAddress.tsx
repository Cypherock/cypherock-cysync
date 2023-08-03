import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Typography } from '@cypherock/cysync-ui/src/components/atoms/Typography';
import { InputWithDynamicPostfix } from '@cypherock/cysync-ui/src/components/atoms/Input';
import { Throbber } from '@cypherock/cysync-ui/src/components/atoms/Throbber';
import { Image } from '@cypherock/cysync-ui/src/components/atoms/Image';
import { qrCodeIcon } from '@cypherock/cysync-ui/src/assets';

// Assuming Typography and InputWithDynamicPostfix are imported correctly
// import { Typography } from "./Typography";
// import { InputWithDynamicPostfix } from "./InputWithDynamicPostfix";

interface RecipientAddressProps {
  text?: string;
  placeholder: string;
  error?: string;
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
      <Typography variant="span" width="100%" color="muted" $fontSize={13}>
        {text}
      </Typography>
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
};
export default RecipientAddress;
