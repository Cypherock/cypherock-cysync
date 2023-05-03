import { css } from 'styled-components';
import { theme } from '../../../themes/theme.styled';

export interface MarginProps {
  mb?:
    | 'mb0'
    | 'mbOne'
    | 'mbTwo'
    | 'mbThree'
    | 'mbFour'
    | 'mbFive'
    | 'mbSix'
    | 'mbSeven'
    | 'mbEight';
  mr?:
    | 'mr0'
    | 'mrOne'
    | 'mrTwo'
    | 'mrThree'
    | 'mrFour'
    | 'mrFive'
    | 'mrSix'
    | 'mrSeven'
    | 'mrEight'
    | 'mrAuto';
  ml?:
    | 'ml0'
    | 'mlOne'
    | 'mlTwo'
    | 'mlThree'
    | 'mlFour'
    | 'mlFive'
    | 'mlSix'
    | 'mlSeven'
    | 'mlEight'
    | 'mlAuto';
  mt?:
    | 'mt0'
    | 'mtOne'
    | 'mtTwo'
    | 'mtThree'
    | 'mtFour'
    | 'mtFive'
    | 'mtSix'
    | 'mtSeven'
    | 'mtEight';
}

export interface PaddingProps {
  pb?:
    | 'pb0'
    | 'pbOne'
    | 'pbTwo'
    | 'pbThree'
    | 'pbFour'
    | 'pbFive'
    | 'pbSix'
    | 'pbSeven'
    | 'pbEight';

  pt?:
    | 'pt0'
    | 'ptOne'
    | 'ptTwo'
    | 'ptThree'
    | 'ptFour'
    | 'ptFive'
    | 'ptSix'
    | 'ptSeven'
    | 'ptEight';

  pl?:
    | 'pl0'
    | 'plOne'
    | 'plTwo'
    | 'plThree'
    | 'plFour'
    | 'plFive'
    | 'plSix'
    | 'plSeven'
    | 'plEight';

  pr?:
    | 'pr0'
    | 'prOne'
    | 'prTwo'
    | 'prThree'
    | 'prFour'
    | 'prFive'
    | 'prSix'
    | 'prSeven'
    | 'prEight';
}

export const margin = css<MarginProps>`
  margin-bottom: ${props => {
    if (props.mb === 'mbOne') return theme.spacing.one.spacing;
    if (props.mb === 'mbTwo') return theme.spacing.two.spacing;
    if (props.mb === 'mbThree') return theme.spacing.three.spacing;
    if (props.mb === 'mbFour') return theme.spacing.four.spacing;
    if (props.mb === 'mbFive') return theme.spacing.five.spacing;
    if (props.mb === 'mbSix') return theme.spacing.six.spacing;
    if (props.mb === 'mb0') return '0px';
    if (props.mb === 'mbSeven') return theme.spacing.seven.spacing;
    if (props.mb === 'mbEight') return theme.spacing.eight.spacing;
    return '';
  }};
  margin-top: ${props => {
    if (props.mt === 'mtOne') return theme.spacing.one.spacing;
    if (props.mt === 'mtTwo') return theme.spacing.two.spacing;
    if (props.mt === 'mtThree') return theme.spacing.three.spacing;
    if (props.mt === 'mtFour') return theme.spacing.four.spacing;
    if (props.mt === 'mtFive') return theme.spacing.five.spacing;
    if (props.mt === 'mtSix') return theme.spacing.six.spacing;
    if (props.mt === 'mt0') return '0px';
    if (props.mt === 'mtSeven') return theme.spacing.seven.spacing;
    if (props.mt === 'mtEight') return theme.spacing.eight.spacing;
    return '';
  }};
  margin-left: ${props => {
    if (props.ml === 'mlOne') return theme.spacing.one.spacing;
    if (props.ml === 'mlTwo') return theme.spacing.two.spacing;
    if (props.ml === 'mlThree') return theme.spacing.three.spacing;
    if (props.ml === 'mlFour') return theme.spacing.four.spacing;
    if (props.ml === 'mlFive') return theme.spacing.five.spacing;
    if (props.ml === 'mlSix') return theme.spacing.six.spacing;
    if (props.ml === 'ml0') return '0px';
    if (props.ml === 'mlSeven') return theme.spacing.seven.spacing;
    if (props.ml === 'mlEight') return theme.spacing.eight.spacing;
    if (props.ml === 'mlAuto') return 'auto';
    return '';
  }};
  margin-right: ${props => {
    if (props.mr === 'mrOne') return theme.spacing.one.spacing;
    if (props.mr === 'mrTwo') return theme.spacing.two.spacing;
    if (props.mr === 'mrThree') return theme.spacing.three.spacing;
    if (props.mr === 'mrFour') return theme.spacing.four.spacing;
    if (props.mr === 'mrFive') return theme.spacing.five.spacing;
    if (props.mr === 'mrSix') return theme.spacing.six.spacing;
    if (props.mr === 'mr0') return '0px';
    if (props.mr === 'mrSeven') return theme.spacing.seven.spacing;
    if (props.mr === 'mrEight') return theme.spacing.eight.spacing;
    if (props.mr === 'mrAuto') return 'auto';
    return '';
  }};
`;

export const padding = css<PaddingProps>`
  padding-bottom: ${props => {
    if (props.pb === 'pbOne') return theme.spacing.one.spacing;
    if (props.pb === 'pbTwo') return theme.spacing.two.spacing;
    if (props.pb === 'pbThree') return theme.spacing.three.spacing;
    if (props.pb === 'pbFour') return theme.spacing.four.spacing;
    if (props.pb === 'pbFive') return theme.spacing.five.spacing;
    if (props.pb === 'pbSix') return theme.spacing.six.spacing;
    if (props.pb === 'pb0') return '0px';
    if (props.pb === 'pbSeven') return theme.spacing.seven.spacing;
    if (props.pb === 'pbEight') return theme.spacing.eight.spacing;
    return '';
  }};

  padding-top: ${props => {
    if (props.pt === 'ptOne') return theme.spacing.one.spacing;
    if (props.pt === 'ptTwo') return theme.spacing.two.spacing;
    if (props.pt === 'ptThree') return theme.spacing.three.spacing;
    if (props.pt === 'ptFour') return theme.spacing.four.spacing;
    if (props.pt === 'ptFive') return theme.spacing.five.spacing;
    if (props.pt === 'ptSix') return theme.spacing.six.spacing;
    if (props.pt === 'pt0') return '0px';
    if (props.pt === 'ptSeven') return theme.spacing.seven.spacing;
    if (props.pt === 'ptEight') return theme.spacing.eight.spacing;
    return '';
  }};

  padding-left: ${props => {
    if (props.pl === 'plOne') return theme.spacing.one.spacing;
    if (props.pl === 'plTwo') return theme.spacing.two.spacing;
    if (props.pl === 'plThree') return theme.spacing.three.spacing;
    if (props.pl === 'plFour') return theme.spacing.four.spacing;
    if (props.pl === 'plFive') return theme.spacing.five.spacing;
    if (props.pl === 'plSix') return theme.spacing.six.spacing;
    if (props.pl === 'pl0') return '0px';
    if (props.pl === 'plSeven') return theme.spacing.seven.spacing;
    if (props.pl === 'plEight') return theme.spacing.eight.spacing;
    return '';
  }};

  padding-right: ${props => {
    if (props.pr === 'prOne') return theme.spacing.one.spacing;
    if (props.pr === 'prTwo') return theme.spacing.two.spacing;
    if (props.pr === 'prThree') return theme.spacing.three.spacing;
    if (props.pr === 'prFour') return theme.spacing.four.spacing;
    if (props.pr === 'prFive') return theme.spacing.five.spacing;
    if (props.pr === 'prSix') return theme.spacing.six.spacing;
    if (props.pr === 'pr0') return '0px';
    if (props.pr === 'prSeven') return theme.spacing.seven.spacing;
    if (props.pr === 'prEight') return theme.spacing.eight.spacing;
    return '';
  }};
`;
