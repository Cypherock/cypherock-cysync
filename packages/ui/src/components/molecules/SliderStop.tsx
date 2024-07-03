import React, { CSSProperties, FC, useState } from 'react';
import { styled } from 'styled-components';
import { colors } from '../../themes/color.styled';

export interface SliderStopProps {
  Label: string;
  isActive: boolean;
}

const ContainerStyle: CSSProperties = {
  fontFamily: 'Poppins',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '18px',
  textAlign: 'center',
  width: '45px',
  height: '66px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const StyledContainer = styled.div<{
  isActive: boolean;
  isSelected: boolean;
  isHover: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-top: ${({ isActive, isSelected, isHover }) =>
    !isActive && (isSelected || isHover) ? '0px' : '8px'};
  border: 8px solid
    ${({ isActive, isSelected, isHover }) =>
      !isActive && (isSelected || isHover) ? colors.active.main : 'inherit'};
  background: ${({ isActive, isSelected, isHover }) =>
    isActive || isSelected || isHover
      ? colors.text.gold
      : colors.background.separator};
`;

const TextStyle = (isSelected: boolean, isHover: boolean): CSSProperties => ({
  background:
    isSelected && !isHover ? colors.text.gold : colors.background.muted,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export const SliderStop: FC<SliderStopProps> = ({ Label, isActive }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setisSelected(!isSelected);
    }
  };

  return (
    <div
      style={ContainerStyle}
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setisSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <StyledContainer
        isActive={isActive}
        isSelected={isSelected}
        isHover={isHover}
      />
      <div style={TextStyle(isSelected, isHover)}>
        {!isActive && (isHover || isSelected) ? Label : ''}
      </div>
    </div>
  );
};
