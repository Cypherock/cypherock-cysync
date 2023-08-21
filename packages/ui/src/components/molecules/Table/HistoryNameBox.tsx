import React, { FC } from 'react';
import styled from 'styled-components';
import { Container, Typography, TypographyColor } from '../../atoms';
import { iconBoxStyles } from './TableIconNameBox';
import { SvgProps } from '../../../assets';
import { BgColorProps, bgColor } from '../../utils';

interface HistoryNameBoxProps {
  icon: React.FC<SvgProps>;
  fill: string;
  variant: 'grey' | 'success';
  title: string;
  textColor?: TypographyColor;
  subtitle: string;
  date?: string;
  size?: 'small' | 'big';
}

const HistoryNameBoxStyle = styled.div<HistoryNameBoxProps>`
  ${iconBoxStyles}
`;

interface MiniContainerProps extends BgColorProps {
  variant?: string;
  onClick?: () => void;
}

export const MiniContainer = styled.div<MiniContainerProps>`
  display: flex;
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
  ${bgColor}
`;

export const HistoryNameBox: FC<HistoryNameBoxProps> = ({ ...props }) => {
  const IconComponent = props.icon;

  return (
    <HistoryNameBoxStyle {...props}>
      <MiniContainer $bgColor="separator">
        <IconComponent fill={props.fill} />
      </MiniContainer>

      <Container direction="column" gap={0} align="flex-start">
        <Typography
          variant="p"
          $fontWeight="semibold"
          color={props.textColor ?? undefined}
        >
          {props.title}
        </Typography>
        <Container gap={5} display="flex" direction="row">
          <Typography variant="p" color="muted">
            {props.subtitle}
          </Typography>

          {props.date && (
            <>
              <Typography variant="p" color="divider">
                |
              </Typography>
              <Typography variant="p" color="normal">
                {props.date}
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
  textColor: undefined,
};
