import styled from 'styled-components';
import { ReactNode } from 'react';
import { utils, UtilsProps } from '../../util';

export interface ListProps extends UtilsProps {
  children?: ReactNode;
  border?: 'roundedListBottom' | 'roundedListTop';
}

export const UnOrderedListStyle = styled.ul`
  ${utils};
  border-bottom-left-radius: ${(props: ListProps) =>
    props.border === 'roundedListBottom' ? '24px' : ''};
  border-bottom-right-radius: ${(props: ListProps) =>
    props.border === 'roundedListBottom' ? '24px' : ''};
`;

export const ListItemStyle = styled.li`
  ${utils};
`;

export const OrderedListStyle = styled.ul`
  ${utils};
`;
