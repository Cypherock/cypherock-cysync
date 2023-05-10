import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { InputProps, SearchBarStyle } from './Input';

interface CopyImageStyleProps {
  isCopied: boolean;
}

export const ClipboardBarStyle = styled.div`
  position: relative;
  width: 100%;
  .image-copy {
    position: absolute;
    right: 24px;
    bottom: 16px;
  }
`;

export const CopyImageStyle = styled.div<CopyImageStyleProps>`
  height: 20px;
  width: 25px;
`;

export const ClipboardBar: FC<InputProps> = ({ placeholder }) => {
  // states
  const [isCopied, setIsCopied] = useState(false);

  // functions
  const toggleCopied = () => {
    if (placeholder) {
      navigator.clipboard.writeText(placeholder);
      setIsCopied(true);
    }
  };
  return (
    <ClipboardBarStyle>
      <SearchBarStyle placeholder={placeholder} />
      <CopyImageStyle
        className="image-copy"
        onClick={toggleCopied}
        isCopied={isCopied}
      />
    </ClipboardBarStyle>
  );
};
