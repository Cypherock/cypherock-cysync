import { ReactNode } from "react";
import styled, {css} from "styled-components";
import passwordHide from "@assets/images/onboarding/setPass/password-hide.png";

export interface InputProps {
  children?: ReactNode;
  type?: string;
  placeholder?: string;
};

interface EyeImageStyleProps {
  type: string
}

export const InputContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
  img {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`;

export const InputLabelStyle = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.textMuted};
  margin: ${({ theme }) => theme.spacing.one.spacing};
  letter-spacing: 0.12em;
`;

export const InputStyle = styled.input`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.12em;
    color: #8B8682;
  }
`;

export const SearchBarStyle = styled.input`
  width: 100%;
  border: 1px solid #39322c;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  color: ${({ theme }) => theme.palette.text.mutedText};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  ::placeholder {
    color: ${({ theme }) => theme.palette.text.textMutted};
  }
`;

export const InputTextAreaStyle = styled.textarea `
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  height: 182px;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #8B8682;
  }
`

// TODO: change the image for password show
export const EyeImageStyle = styled.div<EyeImageStyleProps>`
  height: 20px;
  width: 20px;
  ${(props) => {
    return (
      props.type === "password"
      ? css`
        background-image: url(${passwordHide});
      `
      : css`
        background-image: url(${passwordHide});
      `
    );
  }}
`

export const InputPasswordStyle = styled.div `
  width: 100%;
  .image-pass {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`

