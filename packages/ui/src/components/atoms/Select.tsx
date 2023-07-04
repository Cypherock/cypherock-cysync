import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface SelectProps {
  children?: ReactNode;
}

const SelectContainerStyle = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.input};

  select {
    appearance: none;
    outline: none;
    height: 51px;
    background-color: ${({ theme }) => theme.palette.background.input};
    border: none;
    padding: 0 1em 0 0;
    margin: 0;
    width: 100%;
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.12em;
    color: white;
    border-radius: ${({ theme }) => theme.spacing.one.spacing};
    padding-left: 21px;
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: 22px;
  }
`;

export const SelectContainer: FC<SelectProps> = ({ children }) => (
  <SelectContainerStyle>{children}</SelectContainerStyle>
);

SelectContainer.defaultProps = {
  children: null,
};
