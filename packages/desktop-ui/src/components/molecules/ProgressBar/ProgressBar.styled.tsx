import styled from 'styled-components';

export interface ProgressBarStylesProps {
  completed: number;
}

export const ProgressBarStyles = styled.div<ProgressBarStylesProps>`
  height: 20px;
  width: '100%';
  margin: 50;
  border-radius: 10px 10px 10px 10px;
  border-width: 1.5px;
  border-style: solid;
  border-color: #b78d51;

  .filter {
    height: '100%';
    width: ${props => `${props.completed}%`};
    background: linear-gradient(
      90deg,
      #e9b873 0.19%,
      #fedd8f 37.17%,
      #b78d51 100.19%
    );
    text-align: 'right';
    border-radius: 10px 0px 0px 10px;
  }

  .label {
    visibility: hidden;
    padding: 5;
    color: 'white';
    font-weight: 'bold';
  }
`;
