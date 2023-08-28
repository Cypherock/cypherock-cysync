import { styled } from 'styled-components';

export const MainAppBody = styled.div<{ $topbarHeight: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  position: absolute;
  overflow: auto;

  max-height: ${({ $topbarHeight }) => `calc(100vh - ${$topbarHeight}px`} );
`;

export const MainAppBodyWrapper = styled.div`
  position: relative;
`;
