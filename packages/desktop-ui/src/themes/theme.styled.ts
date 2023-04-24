import { colors } from './color.styled.js';
import { typography } from './typography.styled.js';
import { spacing } from './layout.styled.js';

export type ThemeType = typeof theme;

export const theme = {
  palette: {
    primary: {
      primary: colors.gradients.gradientPrimary,
    },
    secondary: {
      secondary: colors.gradients.gradientSecondary,
    },
    info: {
      main: colors.info.main,
    },
    warning: {
      main: colors.warning.main,
    },
    success: {
      main: colors.success.main,
    },
    text: {
      textHeading: colors.text.headingText,
      textList: colors.text.listText,
      textMuted: colors.text.mutedText,
    },
    background: {
      progressBarBackground: colors.background.progressBarBackground,
      inputBackground: colors.background.inputBackground,
      blurBackground: colors.background.blurBackground,
      sepratorBackground: colors.background.sepratorBackground,
      contentBackground: colors.gradients.contentGradient,
      sideBarBackground: colors.gradients.sideBarGradient,
    },
    border: {
      main: colors.border.popupBorder,
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    h1: {
      fontSize: typography.h1,
    },
    h2: {
      fontSize: typography.h2,
    },
    h3: {
      fontSize: typography.h3,
    },
    h4: {
      fontSize: typography.h4,
    },
    h5: {
      fontSize: typography.h5,
    },
    h6: {
      fontSize: typography.h6,
    },
  },
  spacing: {
    one: {
      spacing: spacing.one,
    },
    two: {
      spacing: spacing.two,
    },
    three: {
      spacing: spacing.three,
    },
    four: {
      spacing: spacing.four,
    },
    five: {
      spacing: spacing.five,
    },
    six: {
      spacing: spacing.six,
    },
    seven: {
      spacing: spacing.seven,
    },
    eight: {
      spacing: spacing.eight,
    },
    nine: {
      spacing: spacing.nine,
    },
    ten: {
      spacing: spacing.ten,
    },
    eleven: {
      spacing: spacing.eleven,
    },
    twelve: {
      spacing: spacing.twelve,
    },
  },
  shadow: {
    popupShadow: colors.shadow.popupShadow,
  },
};
