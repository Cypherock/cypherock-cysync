import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { SpacingProps, WidthProps } from '../../utils';
import { HeightProps } from '../../utils/height.styled';
import { theme } from '../../../themes/theme.styled';
import { Button, Image, Container } from '../..';
import { eyeDisabledIcon } from '../../../assets';

type InputContainerProps = WidthProps & HeightProps & SpacingProps;
type InputType = 'text' | 'password';
export interface InputProps extends InputContainerProps {
  type: InputType;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string | number | readonly string[];
}

const InputStyle = styled.input.attrs(props => ({
  type: props.type,
}))`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  width: 100%;
  height: 100%;
  gap: 24px;

  background: ${theme.palette.background.input};
  color: ${theme.palette.text.muted};
  border: 1px solid ${theme.palette.background.separator};
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;

export const Input: FC<InputProps> = ({
  type,
  onChange,
  value,
  ...containerProps
}) => {
  const isPasswordInput = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [inputType, setInputType] = React.useState<InputType>(type);
  const getType = () => {
    if (isPasswordInput) {
      if (isPasswordVisible) return 'text';
      return 'password';
    }
    return type;
  };
  useEffect(() => {
    setInputType(getType());
  }, [isPasswordVisible]);
  return (
    <Container {...containerProps} position="relative">
      <Container
        position="absolute"
        right={24}
        display={isPasswordInput ? 'flex' : 'none'}
      >
        <Button
          variant="none"
          align="center"
          display="flex"
          onClick={() => {
            setIsPasswordVisible(!isPasswordVisible);
          }}
        >
          <Image src={eyeDisabledIcon} alt="Show Password" width="full" />
        </Button>
      </Container>
      <InputStyle type={inputType} onChange={onChange} value={value} />
    </Container>
  );
};

Input.defaultProps = {
  onChange: undefined,
  value: undefined,
};
