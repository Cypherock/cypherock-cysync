import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { cysyncLogoSmall } from '../../../assets/images';
import { Flex, Image, Typography } from '../../atoms';
import {
  spacing,
  SpacingProps,
  width,
  WidthProps,
  height,
  HeightProps,
} from '../../utils';

interface SideBarWrapperProps extends HeightProps, WidthProps, SpacingProps {
  children?: ReactNode;
  title?: string;
}

const SideBarWrapperStyle = styled.div<SideBarWrapperProps>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.background.sidebar};
  overflow-y: auto;
  ${width}
  ${height}
  ${spacing}
`;

export const SideBarWrapper: FC<SideBarWrapperProps> = ({
  children,
  title,
  ...props
}) => (
  <SideBarWrapperStyle pt={4} pb={4} pl={4} pr={3} {...props}>
    <Flex gap={16} mb={4} pb={2}>
      <Image src={cysyncLogoSmall} alt="cysynclogo" $height={20} my="auto" />
      <Typography
        variant="h4"
        color="muted"
        my="auto"
        $fontWeight="medium"
        $fontSize={20}
      >
        {title}
      </Typography>
    </Flex>
    {children}
  </SideBarWrapperStyle>
);

SideBarWrapper.defaultProps = {
  children: undefined,
  title: 'Title',
};
