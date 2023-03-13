import {
  InputContainerStyle,
  InputLabelStyle,
  InputStyle,
  InputProps,
  SearchBarStyle,
  InputTextAreaStyle
} from "./Input.styled";

export const InputLabel = ({ children }: InputProps) => {
  return (
      <InputLabelStyle>{children}</InputLabelStyle>
  );
};

export const Input = ({placeholder, type}: InputProps) => {
  return (
      <InputStyle type={type} placeholder={placeholder}/>
  );
};

export const InputTextArea = ({placeholder}: InputProps) => {
  return <InputTextAreaStyle placeholder={placeholder}/>
}

export const InputContainer = ({ children }: InputProps) => {
  return (
      <InputContainerStyle>{children}</InputContainerStyle>
  );
};

export const SearchBar = ({ children }: InputProps) => {
  return (
      <SearchBarStyle />
  );
};

