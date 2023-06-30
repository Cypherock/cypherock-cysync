import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

import { UtilsProps } from '../../utils';

interface ListItemProps extends UtilsProps {
  children?: ReactNode;
}

const ListItemStyle = styled.li<ListItemProps>`
  color: ${({ theme }) => theme.palette.bullet.white};
`;

export const ListItem: FC<ListItemProps> = ({ children, ...props }) => (
  <ListItemStyle {...props}>{children}</ListItemStyle>
);

ListItem.defaultProps = {
  children: null,
};
