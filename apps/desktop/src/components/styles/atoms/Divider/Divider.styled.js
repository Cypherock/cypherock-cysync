import styled from "styled-components";
import { margin } from "../../util/spacing/Spacing.styled";

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border.main};
  ${margin}
`;
