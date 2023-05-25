import { css } from 'styled-components';
import { generateCss } from './generateCss';
import { MediaQuery } from '../../types/types';

type DisplayType = 'none' | 'inline' | 'block' | 'inline-block' | 'flex';
export interface DisplayProps {
  display?: MediaQuery<DisplayType>;
}

export const display = css<DisplayProps>`
  ${props =>
    props.display &&
    generateCss(['display'], (item: string) => `${item}`, props.display)}
`;
