import { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';
import { Tag } from './Tag';
import { colors } from '../themes/color.styled';
import { Typography } from './Typography';

interface InteractiveItemProps extends TouchableOpacityProps {
  leftIcon?: ReactNode;
  text: string;
  altText?: string;
  rightIcon?: ReactNode;
  rightText?: string;
  tag?: string;
  selected?: boolean;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  padding: 12px 16px;
  padding-right: 24px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

const SelectedBar = styled.View<{ selected: boolean }>`
  min-width: 2px;
  height: 100%;
  background: ${({ selected, theme }) =>
    selected ? theme.palette.text.accent : 'transparent'};
`;

const Icon = styled.View`
  min-width: 12px;
  min-height: 12px;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.View`
  gap: 8px;
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const StyledRightText = styled(Typography)`
  text-align: right;
  text-transform: uppercase;
`;

export function InteractiveItem({
  leftIcon,
  text,
  altText,
  rightIcon,
  rightText,
  tag,
  selected = false,
  ...props
}: InteractiveItemProps) {
  return (
    <Container
      {...props}
      style={selected && { backgroundColor: colors.background.selectedRow }}
    >
      {<SelectedBar selected={selected} />}
      {leftIcon && <Icon>{leftIcon}</Icon>}
      <TextContainer>
        <Typography type="body">{text}</Typography>
        {altText && (
          <Typography type="label" color="muted">
            {altText}
          </Typography>
        )}
        {tag && <Tag>{tag}</Tag>}
      </TextContainer>
      {rightIcon && <Icon>{rightIcon}</Icon>}
      {rightText && <StyledRightText type="body">{rightText}</StyledRightText>}
    </Container>
  );
}

export interface IInteractiveItemListItem extends InteractiveItemProps {
  id: string;
}
