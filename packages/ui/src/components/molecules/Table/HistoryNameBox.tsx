import React, { FC } from 'react';
import styled from 'styled-components';
import { Container, Divider, Typography } from '../../atoms';
import { iconBoxStyles } from './TableIconNameBox';
import SvgArrowReceivedIcon from '../../../assets/icons/generated/ArrowReceivedIcon';

interface HistoryNameBoxProps {
  icon: string;
  title: string;
  subtitle: string;
  date?: string;
  size?: 'small' | 'big';
}

const HistoryNameBoxStyle = styled.div<HistoryNameBoxProps>`
  ${iconBoxStyles}
`;

const IconContainer = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.input};
`;

export const HistoryNameBox: FC<HistoryNameBoxProps> = ({ ...props }) => (
  <HistoryNameBoxStyle {...props}>
    <IconContainer>
      <SvgArrowReceivedIcon fill="#51C61A" />
      {/* <Image src={props.icon} alt="Icon" /> */}
    </IconContainer>

    <Container direction="column" gap={0} align="flex-start">
      <Typography variant="p" $fontWeight="semibold">
        {props.title}
      </Typography>
      <Container gap={8} display="flex" direction="row">
        <Typography variant="p" color="muted">
          {props.subtitle}
        </Typography>

        {props.date && (
          <>
            <Divider variant="vertical" />
            <Typography variant="p">{props.date}</Typography>
          </>
        )}
      </Container>
    </Container>
  </HistoryNameBoxStyle>
);

HistoryNameBox.defaultProps = {
  size: 'big',
  date: undefined,
};
