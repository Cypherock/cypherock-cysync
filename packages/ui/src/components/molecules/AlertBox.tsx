import React, { FC } from 'react';
import styled from 'styled-components';
import { Image, LangDisplay, Typography } from '../atoms';
import { theme } from '../../themes/theme.styled';
import { shieldAlert } from '../../assets';
import { utils, UtilsProps } from '../utils';

interface AlertBoxProps extends UtilsProps {
  alert: string;
}

const MaskStyle = styled.div<Omit<AlertBoxProps, 'alert'>>`
  width: 100%;
  position: relative;
  border-radius: 8px;
  background: ${theme.palette.background.input};
  display: flex;
  border: 1px solid ${theme.palette.border.input};
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  ${utils}
`;

export const AlertBox: FC<AlertBoxProps> = ({ alert, ...props }) => (
  <MaskStyle {...props}>
    <Image width="20" mr="20" src={shieldAlert} alt="Alert" />
    <Typography variant="p">
      <LangDisplay text={alert} />
    </Typography>
  </MaskStyle>
);
