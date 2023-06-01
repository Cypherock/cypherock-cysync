import React, { FC } from 'react';
import styled from 'styled-components';

interface CheckBoxProps {
  checked: boolean;
  onChange: () => void;
}

// const CheckBoxStyle = styled.div<CheckBoxProps>`
//   width: 16px;
//   height: 16px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border-radius: 3px;
//   background-image: ${({ theme }) => theme.palette.golden};

//   div {
//     width: 13px;
//     height: 13px;
//     border-radius: 3px;
//     background-image: ${({ theme }) => theme.palette.background.sideBar};
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   input {
//     -webkit-appearance: none;
//     position: relative;
//     width: 8px;
//     height: 8px;
//     border-radius: 2px;
//     background-image: ${({ theme }) => theme.palette.background.sideBar};
//     cursor: pointer;
//   }

//   input:checked {
//     background-image: ${({ theme }) => theme.palette.golden};
//   }

//   input::before {
//     content: '';
//     position: absolute;
//     top: 55%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: 100%;
//     height: 100%;
//     pointer-events: none;
//     background-size: contain;
//     background-repeat: no-repeat;
//   }

//   input::before {
//     display: none;
//   }

//   input:checked::before {
//     display: block;
//   }
// `;

const CheckBoxStyle = styled.input.attrs({
  type: 'checkbox',
  id: 'checkbox_id',
})`
  -webkit-appearance: none;
`;

const CheckBoxIcon = styled.div`
  background-image: ${({ theme }) => theme.palette.golden};
  width: 8px;
  height: 8px;
  position: absolute;
  top: 4px;
  left: 4px;
  transform: translate(0%, 0%);
`;

const CheckBoxLabelStyle = styled.label.attrs({ htmlFor: 'checkbox_id' })`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-image: ${({ theme }) => theme.palette.golden};
  position: relative;

  &:before {
    content: '';
    width: 13px;
    height: 13px;
    border-radius: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: ${({ theme }) => theme.palette.background.sideBar};
  }
`;

export const CheckBox: FC<CheckBoxProps> = ({ checked, onChange }) => (
  <>
    <CheckBoxStyle checked={checked} onChange={onChange} />
    <CheckBoxLabelStyle>{checked && <CheckBoxIcon />}</CheckBoxLabelStyle>
  </>
);
