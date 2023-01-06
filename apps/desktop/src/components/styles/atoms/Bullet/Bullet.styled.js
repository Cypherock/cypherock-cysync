import styled, { css } from "styled-components";

export const Bullet = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.textHeading};
`;
