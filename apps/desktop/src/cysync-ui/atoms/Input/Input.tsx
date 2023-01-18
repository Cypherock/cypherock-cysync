import {
  InputContainerStyle,
  InputLabelStyle,
  InputStyle,
  InputProps,
} from "./Input.styled";

export const InputLabel = ({ children }: InputProps) => {
  return (
    <>
      <InputLabelStyle>{children}</InputLabelStyle>
    </>
  );
};

export const Input = ({}: InputProps) => {
  return (
    <>
      <InputStyle />
    </>
  );
};

export const InputContainer = ({ children }: InputProps) => {
  return (
    <>
      <InputContainerStyle>{children}</InputContainerStyle>
    </>
  );
};

// Usage
// <InputContainerStyle>
// <InputLabel></InputLabel>
// <Input />
// </InputContainerStyle>
