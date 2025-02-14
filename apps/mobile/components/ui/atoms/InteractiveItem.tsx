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
  $parentId?: string;
}

const Container = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex-direction: row;
  padding: 12px 16px;
  padding-right: 24px;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const SelectedBar = styled.View<{ selected: boolean }>`
  min-width: 2px;
  height: 100%;
  background: ${({ selected, theme }) =>
    selected ? theme.palette.text.accent : 'transparent'};
  margin-right: 4px;
`;

const Icon = styled.View`
  min-width: 12px;
  min-height: 12px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const TextContainer = styled.View`
  gap: 4px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-right: 4px;
`;

const StyledRightText = styled(Typography)`
  flex: 1;
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
        <Typography type="body" style={{ flexShrink: 0 }}>
          {text}
        </Typography>
        {altText && (
          <Typography type="label" color="muted">
            {altText}
          </Typography>
        )}
        {tag && <Tag>{tag}</Tag>}
      </TextContainer>
      {rightIcon && <Icon>{rightIcon}</Icon>}
      {rightText && (
        <StyledRightText type="body" numberOfLines={1} ellipsizeMode="middle">
          {rightText}
        </StyledRightText>
      )}
    </Container>
  );
}

export interface IInteractiveItemListItem extends InteractiveItemProps {
  id: string;
}
