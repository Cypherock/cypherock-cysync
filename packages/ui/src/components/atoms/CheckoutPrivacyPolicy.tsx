import React, { useState } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const InnerBox = styled.div`
  width: 12px;
  height: 12px;
  z-index: 10;
  border-radius: 3px;
  background-color: #1e1e1e;
`;

const StyledCheckbox = styled.div`
  width: 12px;
  height: 12px;
  border: 1.5px solid transparent;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background: linear-gradient(
    90deg,
    #e9b873 0.19%,
    #fedd8f 37.17%,
    #b78d51 100.19%
  );
  &:hover {
    border-color: #aaa;
  }
`;

const Text = styled.div`
  margin-left: 10px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #8b8682;
`;

export const CheckoutPrivacyPolicy = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Container>
      <StyledCheckbox onClick={() => setIsChecked(!isChecked)}>
        {' '}
        {!isChecked && <InnerBox />}{' '}
      </StyledCheckbox>
      <Text>I have read and agree to Cypherock&apos;s privacy policy</Text>
    </Container>
  );
};
