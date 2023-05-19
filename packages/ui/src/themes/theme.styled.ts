import { colors } from './color.styled';
import { typography } from './typography.styled';
import { spacing } from './layout.styled';
import { shadows } from './shadow.styled';
import { screens } from './screens.styled';

export type ThemeType = typeof theme;

export const theme = {
  screens: {
    laptop: `(min-width: ${screens.laptop})`,
    laptopL: `(min-width: ${screens.laptopL})`,
    desktop: `(min-width: ${screens.desktop})`,
  },
  palette: {
    bullet: {
      white: colors.bullet.white,
    },
    primary: {
      primary: colors.gradients.primary,
    },
    secondary: {
      secondary: colors.gradients.secondary,
    },
    info: {
      main: colors.info.main,
    },
    warning: {
      main: colors.warning.main,
    },
    golden: colors.gradients.golden,
    success: {
      main: colors.success.main,
    },
    text: {
      heading: colors.text.heading,
      list: colors.text.list,
      muted: colors.text.muted,
    },
    background: {
      progress: colors.background.progressBar,
      input: colors.background.input,
      blur: colors.background.blur,
      primary: colors.gradients.primary,
      secondary: colors.gradients.secondary,
      seprator: colors.background.seperator,
      content: colors.gradients.content,
      sideBar: colors.gradients.sideBar,
    },

    border: {
      popup: colors.border.popup,
      input: colors.border.input,
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
    popup: shadows.popup,
  },
};
