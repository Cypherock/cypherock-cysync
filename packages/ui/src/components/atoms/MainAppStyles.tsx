import { styled } from 'styled-components';

export const MainAppBody = styled.div<{
  $topbarHeight: number;
  $fullHeight?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
  flex: 1;
  position: relative;

  max-height: ${({ $topbarHeight }) => `calc(100vh - ${$topbarHeight}px`});
  ${({ $fullHeight, $topbarHeight }) =>
    $fullHeight && `height: calc(100vh - ${$topbarHeight}px`});
`;
