import styled from "styled-components";

export const PopupContainer = styled.div`
  background-image: ${({ theme }) =>
    theme.palette.background.sideBarBackground};
  padding: 42px 88px;
  border-color: ${({ theme }) => theme.palette.border.main};
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.popupShadow};
`;
