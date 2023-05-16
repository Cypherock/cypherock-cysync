import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';
import { UtilsProps } from '../../utils';

interface ListContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg' | 'sm' | 'md';
}

const ListContainerStyle = styled.ul<ListContainerProps>``;

export const ListContainer: FC<ListContainerProps> = ({
  children,
  ...props
}) => <ListContainerStyle {...props}>{children}</ListContainerStyle>;

ListContainer.defaultProps = {
  children: null,
  size: 'sm',
};
