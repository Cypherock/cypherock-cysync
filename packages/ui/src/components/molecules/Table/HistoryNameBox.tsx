import React, { FC } from 'react';
import styled from 'styled-components';

import { iconBoxStyles } from './TableIconNameBox';

import { SvgProps } from '../../../assets';
import { Container, Typography, TypographyColor } from '../../atoms';
import { BgColorProps, UtilsProps, bgColor, utils } from '../../utils';

interface HistoryNameBoxProps extends UtilsProps {
  $icon: React.FC<SvgProps>;
  fill: string;
  variant: 'grey' | 'success';
  title: string;
  $textColor?: TypographyColor;
  subtitle: string;
  date?: string;
  size?: 'small' | 'big';
}

const HistoryNameBoxStyle = styled.div`
  ${iconBoxStyles}
  ${utils}
`;

interface MiniContainerProps extends BgColorProps {
  variant?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const MiniContainer = styled.div<MiniContainerProps>`
  display: inline-flex;
  position: relative;
  width: 40px;
  height: 40px;
  padding: var(--0-px, 0px);
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${({ variant, theme }) =>
    variant === 'success'
      ? `rgba(81, 198, 26, 0.20)`
      : theme.palette.background.calendar};
  ${({ onClick }) =>
    onClick &&
    `
      &:hover {
        cursor: pointer;
      }
    `}

  ${({ theme, selected }) =>
    selected &&
    `
  &::before {
    content: '';
    position: absolute;
     top: 0;
    right: -0.36px;
    width: 6.36px;
    height: 6.36px;
    border-radius: 50%;
    background: ${theme.palette.background.gold};
  }
`}  

  ${bgColor}
`;

export const HistoryNameBox: FC<HistoryNameBoxProps> = props => {
  const {
    $icon: IconComponent,
    fill,
    $textColor,
    title,
    subtitle,
    date,
  } = props;

  return (
    <HistoryNameBoxStyle {...props}>
      <MiniContainer $bgColor="separator">
        <IconComponent fill={fill} />
      </MiniContainer>

      <Container direction="column" gap={0} align="flex-start">
        <Typography
          variant="p"
          $fontWeight="semibold"
          color={$textColor ?? undefined}
        >
          {title}
        </Typography>
        <Container gap={5} display="flex" direction="row">
          <Typography variant="p" color="muted">
            {subtitle}
          </Typography>

          {date && (
            <>
              <Typography variant="p" color="divider">
                |
              </Typography>
              <Typography variant="p" color="normal">
                {date}
              </Typography>
            </>
          )}
        </Container>
      </Container>
    </HistoryNameBoxStyle>
  );
};

HistoryNameBox.defaultProps = {
  size: 'big',
  date: undefined,
  $textColor: undefined,
};
