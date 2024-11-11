import React, { useState } from 'react';
import { styled } from 'styled-components';
import { colors } from '../../themes/color.styled';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const InnerBox = styled.div`
  width: 12px;
  height: 12px;
  z-index: 10;
  border-radius: 3px;
  background-color: ${colors.background.checkBoxInner};
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
  background: ${colors.gradients.golden};
  &:hover {
    border-color: ${colors.border.checkBoxHover};
  }
`;

const Text = styled.div`
  margin-left: 8px;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 0.05em;
  text-align: left;
  color: ${colors.text.muted};
`;

interface CheckoutPrivacyPolicyProps {
  text: string;
}

export const CheckoutPrivacyPolicy: React.FC<CheckoutPrivacyPolicyProps> = ({
  text,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Container>
      <StyledCheckbox onClick={() => setIsChecked(!isChecked)}>
        {!isChecked && <InnerBox />}
      </StyledCheckbox>
      <Text>{text}</Text>
    </Container>
  );
};
