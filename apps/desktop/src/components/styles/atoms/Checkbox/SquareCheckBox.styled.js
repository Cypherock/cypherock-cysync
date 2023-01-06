import styled from "styled-components";

export const SquareCheckBox = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.primary.primary};

  div {
    width: 13px;
    height: 13px;
    border-radius: 3px;
    background-image: ${({ theme }) =>
      theme.palette.background.sideBarBackground};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input {
    -webkit-appearance: none;
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background-image: ${({ theme }) =>
      theme.palette.background.sideBarBackground};
    cursor: pointer;
  }
  input:checked {
    background-image: ${({ theme }) => theme.palette.primary.primary};
  }
  input::before {
    content: "";
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-size: contain;
    background-repeat: no-repeat;
  }
  input::before {
    display: none;
  }
  input:checked::before {
    display: block;
  }
`;
