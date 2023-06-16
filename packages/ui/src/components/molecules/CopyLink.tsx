import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { utils, UtilsProps } from '../utils';
import { theme } from '../../themes/theme.styled';
import { Image, Typography } from '../atoms';
import { checkIcon, copyIcon } from '../../assets';

interface CopyLinkProps extends UtilsProps {
  link: string;
}

const MaskStyle = styled.div<Omit<CopyLinkProps, 'link'>>`
  width: 100%;
  border-radius: 8px;
  background: ${theme.palette.background.input};
  display: flex;
  border: 1px solid ${theme.palette.border.input};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  ${utils}
`;
export const CopyLink: FC<CopyLinkProps> = ({ link, ...props }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    setCopied(true);
    const timeout = setTimeout(() => {
      setCopied(false);
      if (timeout) clearTimeout(timeout);
    }, 2000);
    await navigator.clipboard.writeText(link);
  };

  return (
    <MaskStyle {...props}>
      <Typography color="muted" variant="p">
        {link}
      </Typography>
      {!copied ? (
        <Image src={copyIcon} height="20" alt="Copy" onClick={handleClick} />
      ) : (
        <Image src={checkIcon} alt="copied" />
      )}
    </MaskStyle>
  );
};
