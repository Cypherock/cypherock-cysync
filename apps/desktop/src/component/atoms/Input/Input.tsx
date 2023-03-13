import {useState} from "react";
import {
  InputContainerStyle,
  InputLabelStyle,
  InputStyle,
  InputProps,
  SearchBarStyle,
  InputTextAreaStyle,
  InputPasswordStyle,
  EyeImageStyle
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

export const InputPassword = ({placeholder}: InputProps) => {
  const [passwordType, setPasswordType] = useState("password");
  const togglePassword = () => {
    if(passwordType==="password") {
      setPasswordType("text")
    } else {
      setPasswordType("password")
    }
  }
  return (
    <InputPasswordStyle>
      <Input type={passwordType} placeholder={placeholder}/>
      <EyeImageStyle className="image-pass" onClick={togglePassword} type={passwordType}/>
    </InputPasswordStyle>
  )
}

