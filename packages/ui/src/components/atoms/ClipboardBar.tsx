import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { SearchBarStyle } from './Input';

interface CopyImageStyleProps {
  isCopied: boolean;
}

interface ClipboardBarProps {
  placeholder: string;
}

const CopyImageStyle = styled.div<CopyImageStyleProps>`
  height: 20px;
  width: 25px;
`;

const ClipboardBarStyle = styled.div`
  position: relative;
  width: 100%;
  .image-copy {
    position: absolute;
    right: 24px;
    bottom: 16px;
  }
`;

export const ClipboardBar: FC<ClipboardBarProps> = ({ placeholder }) => {
  const [isCopied, setIsCopied] = useState(false);

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
