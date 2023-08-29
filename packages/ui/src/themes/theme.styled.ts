import { colors } from './color.styled';
import { spacing } from './layout.styled';
import { screens } from './screens.styled';
import { shadows } from './shadow.styled';
import { typography } from './typography.styled';

export type ThemeType = typeof theme;

export const theme = {
  screens: {
    def: `(min-width: ${screens.def})`,
    md: `(min-width: ${screens.md})`,
    lg: `(min-width: ${screens.lg})`,
    xl: `(min-width: ${screens.xl})`,
  },
  screensHeight: {
    lg: `(min-height: ${screens.lg})`,
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
    content: {
      content: colors.gradients.content,
    },
    info: {
      main: colors.info.main,
    },
    warn: {
      main: colors.warning.main,
    },
    muted: {
      main: colors.text.muted,
    },
    golden: colors.gradients.golden,
    silver: colors.gradients.silver,
    highlight: colors.gradients.highlight,
    success: {
      main: colors.success.main,
    },
    text: {
      ...colors.text,
      disabled: colors.disabled.text,
    },
    shadow: {
      dropdown: colors.shadow.dropdown,
    },
    background: {
      progress: colors.background.progressBar,
      input: colors.background.input,
      container: colors.background.container,
      blur: colors.background.blur,
      primary: colors.gradients.primary,
      secondary: colors.gradients.secondary,
      separator: colors.background.separator,
      content: colors.gradients.content,
      sideBar: colors.gradients.sideBar,
      disabled: colors.disabled.background,
      bar: colors.background.bar,
      gold: colors.gradients.golden,
      golden: colors.background.gold,
      success: colors.success.main,
      successSecondary: colors.success.secondary,
      muted: colors.background.muted,
      inputSecondary: colors.background.inputSecondary,
      separatorSecondary: colors.background.separatorSecondary,
      dropdownHover: colors.background.dropdownHover,
      toggleActive: colors.background.black,
      toggle: colors.background.toggleOff,
      list: colors.background.list,
      info: colors.background.info,
      lightBlack: colors.background.lightBlack,
      sidebar: colors.background.sidebar,
      slider: colors.background.slider,
      warning: colors.background.warning,
      messageSecondary: colors.background.messageSecondary,
      message: colors.background.message,
      breadcrumbSeparator: colors.background.breadcrumbSeparator,
      batchTransactionBody: colors.background.batchTransactionBody,
      popup: colors.border.popup,
    },
    border: {
      popup: colors.border.popup,
      input: colors.border.input,
      info: colors.info.main,
      separator: colors.background.separator,
      warning: colors.border.warning,
      message: colors.border.message,
      messageSecondary: colors.border.messageSecondary,
      error: colors.border.error,
      bar: colors.border.bar,
      white: colors.border.white,
      table: {
        title: colors.border.table.title,
        row: colors.border.table.row,
      },
      list: colors.border.list,
      muted: colors.border.muted,
      gold: colors.border.gold,
      separatorSecondary: colors.border.separatorSecondary,
      infoBox: colors.border.infoBox,
      infoBoxOrange: colors.border.infoBoxOrange,
      subMenuLeft: colors.border.subMenuLeft,
      topbar: colors.border.topbar,
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
