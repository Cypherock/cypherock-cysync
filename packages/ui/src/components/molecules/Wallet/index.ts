import styled from 'styled-components';

import { utils, UtilsProps } from '../../utils';

export * from './WalletHeader';

export const WalletContainer = styled.div<UtilsProps>`
  border-bottom-right-radius: 24px;
  background: ${({ theme }) => theme.palette.content.content};
  ${utils}
`;
