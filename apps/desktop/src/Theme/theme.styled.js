import colors from "./colors";
import typography from "./typography";

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
      headingText: colors.text.headingText,
      listText: colors.text.listText,
      mutedText: colors.text.mutedText,
    },
    background: {
      progressBarBackground: colors.background.progressBarBackground,
      inputBackground: colors.background.inputBackground,
      blurBackground: colors.background.blurBackground,
      sepratorBackground: colors.background.sepratorBackground,
      contentBackground: colors.background.contentGradient,
      sideBarBackground: colors.background.sideBarGradient,
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: "Poppins",
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
};
