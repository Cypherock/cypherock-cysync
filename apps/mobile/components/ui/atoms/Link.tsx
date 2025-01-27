import styled from 'styled-components/native';
import { Link as OgLink } from 'expo-router';

export const Link = styled(OgLink)`
  color: ${({ theme }) => theme.palette.text.accent};
  font-weight: ${({ theme }) => theme.typography.body.shared.fontWeight};
  font-size: ${({ theme }) => theme.typography.body.para.fontSize}px;
`;
