export interface LanguageStrings {
  language: string;
  buttons: LangButtons;
  onboarding: LangOnboarding;
  scan: LangScan;
  portfolio: LangPortfolio;
  history: LangHistory;
  receive: LangReceive;
  support: LangSupport;
  settings: LangSettings;
  notifications: LangNotifications;
  banner: LangBanner;
  toast: LangToast;
  bottomTabs: LangBottomTabs;
}

export interface LangButtons {
  // Common
  ok: string;
  continue: string;
  skip: string;
  apply: string;
  confirm: string;
  login: string;

  // Onboarding
  getStarted: string;
  scanQrCode: string;
  buyCypherockX1: string;
  grantPermission: string;

  // Portfolio
  allWallets: string;
}

export interface LangOnboarding {
  welcome: {
    title: string;
    description: string;
    termsOfUse: string;
    privacyPolicy: string;
    byProceeding: string;
  };
  portfolio: {
    title: string;
    description: string;
  };
  history: {
    title: string;
    description: string;
  };
  receive: {
    title: string;
    description: string;
  };
  scan: {
    title: string;
    description: string[];
  };
  permission: {
    title: string;
    description: string;
  };
  info: {
    title: string;
    description: string;
  };
}

export interface LangScan {
  alignQrCode: string;
  pleaseWait: string;
  messageBox: {
    warning: string;
  };
  loading: {
    description: string;
  };
}

export interface LangPortfolio {
  heading: string;
  noAccount: {
    title: string;
    subTitle: string;
  };
  dashboard: {
    table: {
      asset: string;
      amount: string;
    };
  };
}

export interface LangHistory {
  heading: string;
  history: {
    title: string;
    table: {
      time: string;
      amount: string;
    };
  };
  details: {
    heading: {
      sent: string;
      received: string;
    };
  };
}

export interface LangReceive {
  heading: string;
  chooseWallet: {
    title: string;
  };
  chooseAccount: {
    title: string;
  };
  receive: {
    info: string;
    messageBox: {
      danger: string;
    };
  };
}

export interface LangSupport {
  heading: string;
  support: {
    title: string;
    description: string;
  };
  socials: {
    title: string;
    description: string;
  };
}

export interface LangSettings {
  heading: string;
  settings: {
    general: string;
    app: string;
    about: string;
  };
  // general
  general: {
    heading: string;
    displayLanguage: string;
    preferredCurrency: string;
  };
  displayLanguage: {
    heading: string;
    title: string;
  };
  preferredCurrency: {
    heading: string;
    title: string;
  };
  // about
  about: {
    heading: string;
    title: string;
    termsOfUse: string;
    privacyPolicy: string;
  };
  // app
  app: {
    heading: string;
    addNewPassword: string;
    changePassword: string;
    removePassword: string;
  };
  addNewPassword: {
    title: string;
    inputs: {
      newPassword: {
        placeholder: string;
        description: string;
      };
      confirmPassword: {
        placeholder: string;
        description: string;
      };
      radio: {
        label: string;
      };
    };
  };
  changePassword: {
    title: string;
    inputs: {
      oldPassword: {
        placeholder: string;
      };
      newPassword: {
        placeholder: string;
      };
      description: string;
      confirmPassword: {
        placeholder: string;
        description: string;
      };
      radio: {
        label: string;
      };
    };
  };
  newPasswordAdded: {
    title: string;
    description: string;
  };
  removePassword: {
    title: string;
    description: string;
  };
  passwordRemoved: {
    title: string;
  };
}

export interface LangNotifications {
  heading: string;
}

export interface LangBanner {
  title: string;
  description: string;
}

export interface LangToast {
  addressCopied: string;
}

export interface LangBottomTabs {
  portfolio: string;
  history: string;
  receive: string;
  support: string;
  settings: string;
}
