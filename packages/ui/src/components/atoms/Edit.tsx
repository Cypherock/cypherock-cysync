import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { editDefault, editDisable, editHover } from '../../assets';

const EditDefaultImage = styled.img.attrs({
  src: editDefault,
  alt: 'edit',
})``;

const EditHoverImage = styled.img.attrs({
  src: editHover,
  alt: 'edit hover',
})``;

const EditDisableImage = styled.img.attrs({
  src: editDisable,
  alt: 'edit disabled',
})``;

const determineBackgroundColor = (
  icon: boolean,
  disabled: boolean,
  isHover: boolean,
  isSelected: boolean,
): string => {
  if (icon) return 'inherit';
  if (disabled) return '#2E2A27';
  if (isHover && !isSelected) return '#44403E';
  if (isSelected) return '#2B2724';
  return '#34302D';
};

const StyledContainer = styled.div<{
  icon: boolean;
  disabled: boolean;
  isHover: boolean;
  isSelected: boolean;
}>`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  text-align: center;
  background: ${({ icon, disabled, isHover, isSelected }) =>
    determineBackgroundColor(icon, disabled, isHover, isSelected)};
  overflow: hidden;
  color: #ffffff;
`;

interface ReminderProps {
  icon: boolean;
  disabled: boolean;
}

export const Edit: FC<ReminderProps> = ({ icon, disabled }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const getImage = () => {
    if (disabled) return <EditDisableImage />;
    if (isHover) return <EditHoverImage />;
    return <EditDefaultImage />;
  };

  return (
    <StyledContainer
      icon={icon}
      disabled={disabled}
      isHover={isHover}
      isSelected={isSelected}
      onMouseDown={() => setIsSelected(true)}
      onMouseUp={() => setIsSelected(false)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {getImage()}
    </StyledContainer>
  );
};
