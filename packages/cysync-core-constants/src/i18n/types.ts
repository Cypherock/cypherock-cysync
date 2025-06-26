import {
  BinanceErrorType,
  DeviceErrorCodes,
  IErrorMsg,
  ServerErrorType,
  CoinFamilyWithDefault,
  ServerCoinErrorTypes,
} from '../types';

export interface LanguageStrings {
  x1Card: string;
  help: string;
  back: string;
  allWallets: string;
  labels: LangLabels;
  buttons: LangButtons;
  dashboard: LangDashboard;
  tooltips: LangTooltips;
  deviceAuthentication: LangDeviceAuthentication;
  lockscreen: LangLockscreen;
  permissionSetup: LangPermissionSetup;
  addAccount: LangAddAccount;
  addToken: LangAddToken;
  receive: LangReceive;
  send: LangSend;
  deployAccount: LangDeployAccount;
  history: LangHistory;
  onboarding: LangOnboarding;
  appUpdateBar: LangAppUpdateBar;
  deviceUpdateBar: LangDeviceUpdateBar;
  betaNotificationBar: LangBetaNotificationBar;
  topbar: LangTopbar;
  sidebar: LangSidebar;
  walletSync: LangWalletSync;
  graph: LangGraph;
  walletConnect: LangWalletConnect;
  signMessage: LangSignMessage;
  portfolio: LangPortfolio;
  wallet: LangWallet;
  deleteAccount: LangDeleteAccount;
  errors: LangErrors;
  validation: LangValidation;
  guidedFlows: LangGuidedFlows;
  dialogs: LangDialogs;
  toggle: LangToggle;
  snackbar: LangSnackbar;
  settings: LangSettings;
  onramp: LangOnramp;
  otp: LangOTP;
  inheritance: LangInheritance;
  inheritanceSilverPlanPurchase: LangInheritanceSilverPlanPurchase;
  inheritanceGoldPlanPurchase: LangInheritanceGoldPlanPurchase;
  swap: LangSwap;
}

interface LangLabels {
  email: string;
  required: string;
}

interface LangButtons {
  addWallet: string;
  addAccount: string;
  syncWallets: string;
  addToken: string;
  reverify: string;
  continue: string;
  confirm: string;
  skip: string;
  send: string;
  receive: string;
  back: string;
  retry: string;
  update: string;
  cancel: string;
  reset: string;
  done: string;
  close: string;
  report: string;
  help: string;
  stop: string;
  exit: string;
  resync: string;
  showAll: string;
  connect: string;
  disconnect: string;
  reject: string;
  check: string;
  authenticate: string;
  start: string;
  setPassword: string;
  changePassword: string;
  removePassword: string;
  details: string;
  showQRCode: string;
  editAccount: string;
  submit: string;
  showMore: string;
  resendOTP: string;
  next: string;
  setup: string;
  sync: string;
  learnMore: string;
  checkout: string;
  yes: string;
  no: string;
  saveAndContinue: string;
  exitWithoutSaving: string;
  saveChanges: string;
  edit: string;
  tryAgain: string;
}

interface LangDashboard {
  wallet: {
    renewNow: string;
    buyNow: string;
    created: string;
    expiredOn: string;
    expiresIn: string;
    expiry: string;
    expiring: string;
    expired: string;
    pending: string;
    silver: string;
    gold: string;
    hours: string;
    setupCover: string;
  };
}

interface LangTooltips {
  downloadCsv: string;
}

interface LangDeviceAuthentication {
  success: { title: string };
  loading: { title: string; subtitle: string };
}

interface LangLockscreen {
  title: string;
  passwordLabel: string;
  forgotPassword: string;
  incorrectPassword: string;
  sameOldAndNewPassword: string;
  button: string;
  forgotPasswordDialog: { title: string; subtext: string };
}

interface LangPermissionSetup {
  title: string;
  subtext: string;
  checkbox: string;
}

interface LangAddAccount {
  header: string;
  select: {
    header: string;
    searchText: string;
    walletPlaceholder: string;
    coinPlaceholder: string;
  };
  deviceActions: {
    header: string;
    subtext: string;
    walletName: string;
    actions: {
      verifyCoin: string;
      enterPassphrase: string;
      enterPin: string;
      tapCard: string;
    };
  };
  loader: {
    waitMessage: string;
  };
  sync: {
    syncingHeader: string;
    header: string;
    newAccount: string;
    advancedButton: string;
    accountsNotSynced: string;
    deselectAllButton: string;
    selectAllButton: string;
    accountsInPortfolio: string;
    addAccountButton: string;
    resyncButton: string;
  };
  congrats: {
    header: string;
    subtext: string;
    title: string;
    buttonAddMore: string;
  };
  aside: { tabs: { asset: string; device: string; confirmation: string } };
}

interface LangAddToken {
  header: string;
  select: {
    header: string;
    searchText: string;
    walletPlaceholder: string;
    tokenPlaceholder: string;
    accountPlaceholder: string;
    message: string;
  };
  congrats: { title: string; subtitle: string; buttonAddMore: string };
}

interface LangReceive {
  title: string;
  showAnywayButton: string;
  source: {
    title: string;
    subtitle: string;
    searchText: string;
    walletPlaceholder: string;
    accountPlaceholder: string;
  };
  x1Vault: {
    title: string;
    subtitle: string;
    actions: {
      verifyCoin: string;
      enterPassphrase: string;
      enterPin: string;
      tapCard: string;
    };
  };
  receive: {
    title: {
      prefix: string;
      accountIdPrefix: string;
      principalIdPrefix: string;
      suffix: string;
    };
    addressLabel: string;
    accountIdLabel: string;
    principalIdLabel: string;
    actions: {
      verify: string;
      verifyAccountId: string;
      verifyPrincipalId: string;
    };
    messageBox: {
      warning: string;
      accountIdWarning: string;
      principalIdWarning: string;
    };
    waitMessageBox: { warning: string };
  };
  congrats: { title: string; accountAndPrincipalIdTitle: string };
  finalButtons: {
    secondary: string;
    secondaryUnverified: string;
    secondaryUnverifiedAccountId: string;
    secondaryUnverifiedPrincipalId: string;
    primary: string;
    continue: string;
  };
  aside: { tabs: { source: string; device: string; receive: string } };
}

interface LangSend {
  title: string;
  fees: {
    header: { id: number; label: string; type: string }[];
    sliderLabels: { id: number; name: string }[];
    inputLabels: { gasPrice: string; gasLimit: string };
  };
  source: {
    title: string;
    subtitle: string;
    searchText: string;
    walletPlaceholder: string;
    accountPlaceholder: string;
  };
  x1Vault: {
    title: string;
    actions: {
      verifyCoin: string;
      verifyDetails: string;
      enterPassphrase: string;
      enterPin: string;
      tapCard: string;
    };
    token: { info: string };
    messageBox: { warning: string };
  };
  recipient: {
    title: string;
    subtitle: string;
    recipient: {
      label: string;
      labelSwap: string;
      placeholder: string;
      error: string;
      ownAddress: string;
    };
    icpAccountIdRecipient: {
      label: string;
      labelSwap: string;
      placeholder: string;
      error: string;
      ownAddress: string;
    };
    icpPrincipalIdRecipient: {
      label: string;
      labelSwap: string;
      placeholder: string;
      error: string;
      ownAddress: string;
    };
    tabs: { single: string; batch: string };
    amount: {
      label: string;
      placeholder: string;
      toggle: string;
      dollar: string;
      error: string;
      zeroAmount: string;
      notOverDustThreshold: string;
      amountBelowReserveBalance: string;
      balanceBelowReserveBalance: string;
    };
    fees: { title: string; label: string };
    warning: string;
    feeError: string;
    feeBelowMinError: string;
    notEnoughBalance: string;
    toggleText: { replace: string; unconfirmed: string };
    infoBox: string;
    addButton: string;
    remarks: { label: string; placeholder: string; error: string };
    destinationTag: {
      label: string;
      placeholder: string;
      error: string;
    };
    memo: {
      label: string;
      placeholder: string;
      error: string;
    };
    rentExemptFeeWarning: string;
  };
  summary: {
    title: string;
    from: string;
    to: string;
    amount: string;
    network: string;
    debit: string;
    remarks: string;
    destinationTag: string;
    memo: string;
  };
  finalMessage: {
    button: string;
    title: string;
    hashLabel: string;
    idLabel: string;
    messageBox: { warning: string };
  };
  aside: {
    tabs: {
      source: string;
      recipient: string;
      summary: string;
      x1vault: string;
      confirm: string;
    };
    timer: {
      title: string;
      minutes: string;
      seconds: string;
    };
  };
  optimism: {
    deviceAction: string;
    l1: string;
    l2: string;
    suffix: string;
  };
  tron: {
    notEnoughEnergyWarning: string;
  };
}

interface LangDeployAccount {
  title: string;
  x1Vault: {
    title: string;
    actions: {
      verifyCoin: string;
      verifyDetails: string;
      enterPassphrase: string;
      enterPin: string;
      tapCard: string;
    };
    token: { info: string };
    messageBox: { warning: string };
  };
  summary: {
    title: string;
    from: string;
    account: string;
    fee: string;
    messageBox: { warning: string; error: string };
  };
  finalMessage: {
    button: string;
    title: string;
    hashLabel: string;
  };
  aside: {
    tabs: {
      summary: string;
      x1vault: string;
      confirm: string;
    };
  };
}

interface LangHistory {
  tableTitle: string;
  tableHeader: {
    time: string;
    asset: string;
    walletAndAccount: string;
    wallet: string;
    account: string;
    amount: string;
    value: string;
  };
  transactionStatus: {
    send: { failed: string; pending: string; success: string };
    receive: { failed: string; pending: string; success: string };
  };
  dialogBox: {
    value: string;
    view: string;
    fee: string;
    type: string;
    status: string;
    wallet: string;
    account: string;
    asset: string;
    sender: string;
    receiver: string;
    mine: string;
    transactionHash: string;
    transactionId: string;
    description: string;
    feePrefix: { optimism: string };
    remarks: string;
    destinationTag: string;
    memo: string;
    operation: string;
  };
  noData: { text: string; subText: string; buttonText: string };
  search: { placeholder: string; notFound: { text: string; subText: string } };
}

interface LangOnboarding {
  info: {
    aside: { title: string; subTitle: string };
    dialogBox: { title: string; listItems: string[] };
  };
  usage: {
    userNew: { title: string; note: string };
    userExpert: { title: string; note: string };
  };
  terms: {
    title: string;
    subtext: string;
    bulletPoints: { terms: string; privacyPolicy: string };
    consent: string;
  };
  setPassword: {
    heading: string;
    title: string;
    subtitle: string;
    success: string;
    newPasswordLabel: string;
    confirmPasswordLabel: string;
    hint: string;
  };
  emailAuth: {
    heading: string;
    title: string;
    subtitle: string;
    success: string;
    enterEmailLabel: string;
    placeholder: string;
  };
  deviceDetection: {
    heading: string;
    title: string;
    unavailable: { title: string; subtext: string };
  };
  deviceAuth: {
    heading: string;
    title: string;
    subtext: string;
    success: { title: string; subtext: string };
    error: string;
  };
  joystickTraining: {
    heading: string;
    subtext: string;
    upTitle: string;
    rightTitle: string;
    downTitle: string;
    leftTitle: string;
    centerTitle: string;
    centerSubtext: string;
    footer: string;
    success: string;
    error: string;
  };
  cardTraining: {
    heading: string;
    title: string;
    subtext: string;
    error: string;
  };
  cardAuth: {
    heading: string;
    title: string;
    subtext: string;
  };
  walletActionsDialogBox: {
    title: string;
    subTitle: string;
    createWallet: { title: string; list: string[] };
    importWallet: { title: string; list: string[] };
  };
  success: { title: string; subtext: string };
  appUpdate: {
    heading: string;
    dialogs: {
      checking: { heading: string; title: string };
      checkingFailed: { heading: string; title: string; subtext: string };
      confirmation: { heading: string; title: string; subtext: string };
      downloading: { heading: string; subtext: string; version: string };
      updateSuccessful: {
        heading: string;
        subtext: string;
        bubbleText: string;
      };
      updateFailed: {
        heading: string;
        subtext: string;
        buttons: { retry: string };
      };
      updateFailedFallback: {
        heading: string;
        subtext: string;
        alertText: string;
      };
    };
  };
  deviceUpdate: {
    heading: string;
    version: string;
    dialogs: {
      checking: { title: string };
      confirmation: { heading: string; title: string; subtext: string };
      loading: { text: string };
      updating: { heading: string; subtext: string };
      updateSuccessful: {
        heading: string;
        headingWithVersion: string;
        subtext: string;
      };
      updateFailed: { heading: string; subtext: string };
    };
  };
}

interface LangAppUpdateBar {
  confirmation: string;
  downloading: string;
  error: string;
  successful: string;
  buttons: { download: string; tryAgain: string; installUpdate: string };
}

interface LangDeviceUpdateBar {
  message: string;
  button: string;
}

interface LangBetaNotificationBar {
  message: string;
  button: string;
}

interface LangTopbar {
  statusTexts: {
    connection: { connected: string; disconnected: string; error: string };
    sync: {
      synchronized: string;
      synchronizing: string;
      error: string;
      networkErrorTooltip: string;
    };
  };
  notification: {
    title: string;
    sendTransaction: string;
    sendTransactionMultiple: string;
    receiveTransaction: string;
    noTransactions: { title: string; subTitle: string };
  };
}

interface LangSidebar {
  portfolio: string;
  wallets: string;
  sendCrypto: string;
  receiveCrypto: string;
  history: string;
  walletConnect: string;
  cypherockCover: string;
  referAndEarn: string;
  settings: string;
  help: string;
  buysell: string;
  new: string;
  tooltip: { walletDeleted: string };
}

interface LangWalletSync {
  deletedOne: { title: string };
  deletedMany: { title: string; subTitle: string };
  freshOneCreated: { title: string; subTitle: string; checkboxText: string };
  buttons: { keepIt: string; keepAll: string; delete: string };
}

interface LangGraph {
  totalBalance: string;
  walletDropdown: { search: string };
  timeRange: { day: string; week: string; month: string; year: string };
}

interface LangWalletConnect {
  uriTab: {
    title: string;
    subTitle: string;
    inputLabel: string;
    placeholder: string;
  };
  accountSelectionTab: {
    title: string;
    chooseWallet: string;
    chooseAccount: string;
    supportInfo: string;
    notSupportedWarning: { title: string };
  };
  accountConnectedTab: { title: string; subTitle: string; info: string };
  common: {
    info: { title: string; points: string[] };
    error: {
      default: { title: string; subtitle: string };
      unsupportedChains: { title: string; subtitle: string; message: string };
    };
    reject: { call: string };
  };
}

interface LangSignMessage {
  title: string;
  subTitle: string;
  actions: {
    confirmDevice: string;
    verifyData: string;
    enterPassphrase: string;
    enterPin: string;
    tapCard: string;
  };
}

interface LangPortfolio {
  title: string;
  tokenTable: {
    title: string;
    tableHeader: { token: string; amount: string; value: string };
  };
  assetAllocation: {
    title: string;
    accountTitle: string;
    tableHeader: {
      asset: string;
      account: string;
      wallet: string;
      price: string;
      balance: string;
      value: string;
      allocation: string;
    };
  };
  walletMissing: { text: string; subText: string; subText2: string };
  accountMissing: { text: string; subText: string };
}

interface LangWallet {
  title: string;
  tableTitle: string;
  buttons: { less: string; more: string; hide: string; show: string };
  tableHeader: {
    account: string;
    syncStatus: string;
    balance: string;
    value: string;
  };
  accountMissing: { text: string; subText: string };
  search: { placeholder: string; text: string; subText: string };
}

interface LangDeleteAccount {
  title: string;
  subTitle: string;
  tokenSubtitle: string;
  buttons: { yes: string; no: string };
}

export interface LangErrors {
  deviceErrors: Record<DeviceErrorCodes, IErrorMsg>;
  databaseError: IErrorMsg;
  serverErrors: Record<ServerErrorType, IErrorMsg>;
  binanceErrors: Record<BinanceErrorType, IErrorMsg>;
  serverCoinErrors: Partial<
    Record<CoinFamilyWithDefault, Record<ServerCoinErrorTypes, IErrorMsg>>
  >;
  default: string;
  videoPlaybackError: string;
}

interface LangValidation {
  generic: {
    required: string;
    englishOnly: string;
  };
  email: { invalid: string };
  password: {
    mismatch: string;
    passwordFieldPrefix: string;
    confirmPasswordFieldPrefix: string;
    minLength: string;
    containNumber: string;
    containSymbol: string;
    required: string;
    containUppercase: string;
    containLowercase: string;
  };
}

interface LangGuidedFlows {
  createWallet: {
    title: string;
    skipPinSetup: string;
    tabs: {
      asideTitle: string;
      pages: {
        title: string;
        bulletList?: string[];
        messageBoxList?: {
          info?: string;
          warning?: string;
          'warning-white'?: string;
        }[];
        subtitle?: string;
      }[];
    }[];
  };
  importWallet: {
    title: string;
    tabs: {
      asideTitle: string;
      pages: {
        title: string;
        bulletList?: string[];
        messageBoxList?: {
          info?: string;
          warning?: string;
          'warning-white'?: string;
        }[];
        subtitle?: string;
      }[];
    }[];
  };
  finalMessage: {
    title: string;
    buttons: { secondary: string; primary: string };
  };
  walletNotCreatedDialog: {
    title: string;
    subtitle: string;
    buttons: { secondary: string; primary: string };
  };
  closeDialog: {
    title: string;
    subtitle: string;
    buttons: { secondary: string; primary: string };
  };
}

interface LangDialogs {
  close: { title: string };
  reset: { confim: { title: string; subTitle: string } };
  releaseNote: { title: string };
  auth: {
    title: string;
    email2fa: { title: string; emailInput: string };
    authX1Vault: {
      description: string;
      info: string;
      steps: { confirm: string };
      success: string;
      authenticating: { title: string; description: string };
    };
    authX1Card: {
      description: string;
      info: string;
      steps: { confirm: string; tapCard: string };
      success: string;
    };
  };
  password: {
    input: {
      enterPassword: string;
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    };
    error: { mismatchError: string; lengthError: string; failedToSet: string };
    success: { change: string; set: string; remove: string };
    info: { constraints: string };
    confimPassword: { title: string; subTitle: string };
    createNewPassword: { title: string; subTitle: string };
  };
  contactSupport: {
    form: {
      header: string;
      title: string;
      description: string;
      field: {
        email: { label: string; placeholder: string };
        category: { label: string; placeholder: string };
        description: { label: string; placeholder: string };
      };
      checks: {
        attachAppLogs: string;
        attachDeviceLogs: string;
        confirmDevice: string;
        fetchingDeviceLogs: string;
        attachedDeviceLogs: string;
      };
      errors: { connectDevice: string; bootloaderMode: string };
    };
    success: { formSubmit: string };
  };
  betaNotification: { title: string; description: string };
  editAccount: {
    header: string;
    accountSelection: {
      title: string;
      subtitle: string;
      searchText: string;
      accountPlaceholder: string;
      walletPlaceholder: string;
    };
    accountEdit: {
      title: string;
      subtitle: string;
      input: {
        accountName: {
          title: string;
          subtitle: string;
        };
        unit: {
          title: string;
          subtitle: string;
        };
      };
      buttons: {
        remove: string;
        apply: string;
      };
      info: string;
      advanced: string;
    };
  };
  inheritanceSyncPlans: {
    enterEmail: {
      title: string;
      subTitle: string;
      button: string;
    };
    verifyEmail: {
      title: string;
    };
  };
  inheritancePlanLogin: {
    walletAuth: {
      title: string;
      subTitle: string;
      actions: {
        confirm: string;
        tapCard: string;
      };
    };
    fetchData: {
      title: string;
      subTitle: string;
    };
    verifyEmail: {
      title: string;
    };
  };
  inheritanceEditExecutorMessage: {
    fetchData: {
      title: string;
      subTitle: string;
    };
    editMessage: {
      title: string;
      form: {
        messageField: { label: string; placeholder: string };
      };
      buttons: {
        exit: string;
        save: string;
      };
      loading: {
        title: string;
        subtitle: string;
      };
    };
    success: {
      title: string;
    };
  };
  inheritanceEditReminderTime: {
    fetchData: {
      title: string;
      subTitle: string;
    };
    reminderSetup: {
      title: string;
      reminderInfo: {
        subtitle: string;
        subtext: string;
      };
      form: {
        reminderField: { label: string; month: string; months: string };
      };
      currentReminder: string;
      loading: {
        title: string;
        subtitle: string;
      };
    };
    success: {
      title: string;
    };
  };
  inheritanceEditUserDetails: {
    editDetails: {
      title: string;
      userTypes: {
        owner: string;
        nominee: string;
        executor: string;
      };
      buttons: {
        verifyEmail: string;
      };
    };
    verifyOtp: {
      loading: {
        title: string;
        subtext: string;
      };
    };
    success: {
      title: string;
    };
  };
  inheritancePinRecovery: {
    title: string;
    sync: {
      name: string;
      walletAuth: {
        title: string;
        subTitle: string;
        actions: {
          confirmAuth: string;
          tapCard: string;
        };
        messageBox: {
          warning: string;
        };
      };
      verifyOtp: {
        title: string;
      };
      fetch: {
        title: string;
        subTitle: string;
      };
    };
    decryptPin: {
      name: string;
      title: string;
      actions: {
        confirmOnDevice: string;
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
      error: {
        title: string;
        subTitle: string;
      };
    };
    viewPin: {
      name: string;
      title: string;
      subTitle: string;
      actions: {
        viewDevice: string;
      };
    };
    success: {
      name: string;
      title: string;
    };
  };
  inheritanceEditEncryptedMessage: {
    confirmation: {
      title: string;
      subTitle: string;
    };
    syncing: {
      title: string;
      subTitle: string;
    };
    decryption: {
      wallet: {
        title: string;
        actions: {
          confirm: string;
          tapCard: string;
        };
        messageBox: {
          warning: string;
        };
        decryption: {
          title: string;
          subTitle: string;
        };
      };
    };
    editMessage: {
      title: string;
      subTitle: string;
      form: {
        cardLocationField: {
          label: string;
          placeholder: string;
          tooltip: string;
        };
        personalMessageField: {
          label: string;
          placeholder: string;
          tooltip: string;
        };
      };
      messageBox: {
        warning: string;
      };
    };
    confirmMessage: {
      title: string;
      subTitle: string;
      actions: {
        confirmOnDevice: string;
        verifyLocation: string;
      };
      messageBox: {
        danger: string;
      };
    };
    encryption: {
      title: string;
      subTitle: string;
      tooltip: string;
      actions: {
        enterPinAndTap: string;
      };
      messageBox: {
        warning: string;
      };
      syncing: {
        title: string;
        subTitle: string;
      };
    };
    success: {
      title: string;
    };
  };
  inheritanceEstateRecovery: {
    title: string;
    instructions: {
      name: string;
      dialogs: {
        settings: { title: string };
        clearData: { title: string };
        confirmClearData: { title: string };
        tapCards: {
          title: string;
          subTitle: string;
          messageBoxList: { warning: string }[];
        };
      };
    };
    wallet: {
      name: string;
      title: string;
      subTitle: string;
      actions: {
        confirm: string;
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
      verification: {
        title: string;
      };
      syncing: {
        title: string;
        subTitle: string;
      };
    };
    decryption: {
      name: string;
      device: {
        title: string;
        subTitle: string;
        actions: {
          confirm: string;
          tapCard: string;
        };
        messageBox: {
          warning: string;
        };
      };
      error: {
        title: string;
        message: string;
      };
    };
    viewPin: {
      name: string;
      title: string;
      subTitle: string;
      actions: {
        view: string;
      };
      messageBox: {
        warning: string;
      };
    };
    viewMessage: {
      name: string;
      title: string;
      tooltip: string;
      form: {
        cardLocationField: {
          label: string;
          placeholder: string;
          tooltip: string;
        };
        personalMessageField: {
          label: string;
          placeholder: string;
          tooltip: string;
        };
        checkBox: {
          label: string;
        };
      };
    };
    confirmation: {
      name: string;
      success: {
        title: string;
        subTitle: string;
      };
    };
  };
  swapDialog: {
    provider: string;
    swapId: string;
    status: string;
    fromTitle: string;
    fromWallet: string;
    fromAccount: string;
    fromAsset: string;
    fromAmount: string;
    fromSender: string;
    toTitle: string;
    toWallet: string;
    toAccount: string;
    toAsset: string;
    toAmount: string;
    toReceiver: string;
  };
}

interface LangToggle {
  on: string;
  off: string;
}

interface LangSnackbar {
  copiedToClipboard: string;
  accountUpdated: string;
  downloadCSV: string;
}

interface LangSettings {
  tabs: {
    general: {
      title: string;
      item: {
        syncMobile: { title: string; description: string };
        editAccount: { title: string; description: string };
        toggleWalletOnPortfolio: { title: string; description: string };
        currency: { title: string; description: string };
        language: { title: string; description: string };
        region: { title: string; description: string };
      };
    };
    app: {
      title: string;
      item: {
        password: { title: string; description: string };
        anayticsAndBugReport: { title: string; description: string };
        reset: { title: string; description: string };
        update: { title: string; description: string };
        usb: { title: string; description: string };
      };
    };
    device: {
      title: string;
      item: {
        x1VaultAuth: { title: string; description: string };
        x1CardAuth: { title: string; description: string };
        transferWallet: { title: string; description: string };
      };
    };
    about: {
      title: string;
      item: {
        cySyncVersion: { title: string; description: string };
        termsOfUse: { title: string; description: string };
        privacyPolicy: { title: string; description: string };
        appTutorials: { title: string; description: string };
      };
    };
  };
}

interface LangOnramp {
  title: string;
  buy: {
    title: string;
    selectCurrency: {
      selectFiat: {
        label: string;
        searchText: string;
        placeholder: string;
      };
      selectCrypto: {
        label: string;
        searchText: string;
        placeholder: string;
      };
      amount: {
        label: string;
        tooltip: string;
        error: string;
        limitError: string;
        noMethodsError: string;
      };
    };
    selectWallet: {
      title: string;
      subtitle: string;
      selectWallet: {
        placeholder: string;
        searchText: string;
      };
      selectAccount: {
        placeholder: string;
        searchText: string;
      };
      selectPaymentMethod: {
        label: string;
        searchText: string;
        placeholder: string;
      };
      messageBox: {
        danger: string;
      };
    };
    redirectOrder: {
      title: string;
      subtitle: string;
      info: {
        accountFieldLabel: string;
        amountFieldLabel: string;
        conversionFieldLabel: string;
      };
      messageBox: {
        info: string;
        action: string;
      };
    };
  };
}

interface LangOTP {
  title: string;
  wrongOtpTitle: string;
  successRedirectTitle: string;
  triesRemaining: string;
  infoTexts: string[];
  noRetries: {
    title: string;
    subTitle: string;
  };
  buttons: {
    resendWithTimeout: string;
  };
}

interface LangInheritance {
  title: string;
  plans: {
    silver: {
      title: string;
      description: string;
    };
    gold: {
      title: string;
      description: string;
    };
  };
  choosePlan: {
    title: string;
    plans: {
      buttonText: string;
      popularTagText: string;
      features: string[];
    };
  };
  homePage: {
    headers: {
      owner: {
        title: string;
        subtitle: string;
      };
      nominee: {
        title: string;
        subtitle: string;
      };
    };
    setup: {
      setupCover: {
        title: string;
        subTitle: string;
      };
      syncFromMail: {
        title: string;
        subTitle: string;
      };
      learnMore: {
        title: string;
        subTitle: string;
      };
    };
  };
  planDetails: {
    walletDetails: {
      createdOn: string;
      expiringOn: string;
      reminderPeriodField: {
        label: string;
        input: string;
        inputPlural: string;
      };
    };
    ownerDetails: {
      title: string;
      form: {
        userNameField: { label: string };
        primaryEmailField: { label: string };
        secondaryEmailField: { label: string };
      };
    };
    nomineeDetails: {
      title: string;
      form: {
        nomineeNameField: { label: string };
        primaryEmailField: { label: string };
        secondaryEmailField: { label: string };
        encryptedMessage: { label: string };
      };
    };
    executorDetails: {
      title: string;
      form: {
        nomineeNameField: { label: string };
        primaryEmailField: { label: string };
        secondaryEmailField: { label: string };
        executorMessage: { label: string };
        assignTo: { label: string };
      };
    };
  };
  buttons: {
    syncFromEmail: string;
    recoverPin: string;
    renewPlan: string;
    unlock: string;
    upgradePlan: string;
  };
  termsOfService: {
    title: string;
    termsOfService: string;
    privacyPolicy: string;
    checkBoxLabel: string;
  };
  dialog: {
    userDetails: {
      form: {
        name: string;
        emailField: {
          label: string;
          tooltip: string;
        };
        alternateEmail: string;
      };
      error: {
        sameEmail: string;
      };
    };
    verifyOTP: {
      primaryEmailOTP: {
        title: string;
      };
      alternateEmailOTP: {
        title: string;
      };
    };
    payment: {
      heading: string;
      form: {
        promoField: { label: string; placeholder: string };
      };
      noOfYear: string;
      total: string;
      year: string;
      couponInput: {
        applyButtonText: string;
        appliedButtonText: string;
      };
      error: {
        errorHeading: string;
        subtext: string;
        differentPlanSubtext: string;
      };
    };
  };
  banner: {
    title: string;
    buttons: {
      knowMore: string;
    };
  };
}

interface LangInheritanceSilverPlanPurchase {
  title: string;
  instructions: {
    heading: string;
    ensure: {
      title: string;
      instructions: string[];
    };
    video: {
      title: string;
    };
  };
  wallet: {
    heading: string;
    selectWallet: {
      title: string;
      subTitle: string;
      tooltips: {
        noPin: string;
        alreadyActive: string;
        isDeleted: string;
      };
    };
    walletAuth: {
      title: string;
      subTitle: string;
      actions: {
        confirm: string;
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
    };
  };
  email: {
    heading: string;
    userDetails: {
      title: string;
      subTitle: string;
      buttons: {
        sendOTP: string;
      };
    };
  };
  encryption: {
    heading: string;
    device: {
      title: string;
      subTitle: string;
      tooltip: string;
      actions: {
        confirm: string;
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
    };
    loading: {
      title: string;
      subTitle: string;
    };
    success: {
      title: string;
      subTitle: string;
    };
  };
  checkout: {
    heading: string;
    payment: {
      title: string;
      subtext: string;
    };
    success: {
      title: string;
      subtext: string;
    };
  };
}

interface LangInheritanceGoldPlanPurchase {
  title: string;
  instructions: {
    heading: string;
    ensure: {
      title: string;
      instructions: string[];
    };
    video: {
      title: string;
    };
  };
  wallet: {
    heading: string;
    selectWallet: {
      title: string;
      subTitle: string;
      tooltips: {
        noPin: string;
        alreadyActive: string;
        isDeleted: string;
      };
    };
    walletAuth: {
      heading: string;
      title: string;
      subTitle: string;
      actions: {
        confirmOnDevice: string;
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
      error: {
        title: string;
        subtext: string;
        messageBox: {
          warning: string;
        };
      };
    };
  };
  email: {
    heading: string;
    userDetails: {
      title: string;
      form: {
        name: string;
        emailField: {
          label: string;
          tooltip: string;
        };
        alternateEmail: string;
      };
      buttons: {
        sendOTP: string;
      };
    };
    primaryEmailOTP: {
      title: string;
    };
    alternateEmailOTP: {
      title: string;
    };
  };
  nomineeAndExecutor: {
    heading: string;
    select: {
      title: string;
      subtitle: string;
      tooltip: string;
      options: {
        descOne: string;
        descTwo: string;
      };
    };
    nomineeDetails: {
      first: {
        title: string;
        warning: string;
        tooltip: string;
      };
      second: {
        title: string;
        warning: string;
      };
      confirm: {
        title: string;
        subtext: string;
        warning: string;
      };
    };
    executor: {
      select: {
        title: string;
        subtext: string;
        tooltip: string;
        options: {
          one: {
            yes: string;
            desc: string;
          };
          two: {
            no: string;
            desc: string;
          };
        };
      };
      executorDetails: {
        title: string;
        tooltip: string;
        radio: {
          label: string;
          tooltip: string;
          options: {
            labelPrefix: string;
          };
          messageBox: {
            warning: string;
          };
        };
      };
    };
  };
  message: {
    heading: string;
    tutorial: {
      title: string;
      subtext: string;
    };
    nominee: {
      title: string;
      subtitle: string;
      tooltip: string;
      form: {
        locationField: {
          label: string;
          placeholder: string;
          tooltip: string;
        };
        personalMessage: {
          label: string;
          placeholder: string;
          tooltip: string;
        };
      };
      messageBox: {
        warning: string;
      };
    };
    executor: {
      title: string;
      subtitle: string;
      tooltip: string;
      form: {
        messageField: {
          label: string;
          placeholder: string;
        };
      };
    };
  };
  reminder: {
    heading: string;
    title: string;
  };
  summary: {
    heading: string;
    title: string;
    subtitle: string;
    ownerDetails: {
      title: string;
      form: {
        userNameField: { label: string };
        primaryEmailField: { label: string };
        secondaryEmailField: { label: string };
        reminderPeriodField: {
          label: string;
          input: string;
          inputPlural: string;
        };
      };
    };
    nomineeDetails: {
      title: string;
      form: {
        nomineeNameField: { label: string };
        primaryEmailField: { label: string };
        secondaryEmailField: { label: string };
      };
    };
    cardLocation: {
      title: string;
    };
    personalMessage: {
      title: string;
    };
    executorDetails: {
      title: string;
      form: {
        nomineeNameField: { label: string };
        primaryEmailField: { label: string };
        secondaryEmailField: { label: string };
        assignTo: { label: string };
      };
    };
    executorMessage: {
      title: string;
    };
  };
  encryption: {
    heading: string;
    confirm: {
      title: string;
      subtext: string;
      actions: {
        confirmOnDevice: string;
        verifyLocation: string;
      };
      messageBox: {
        danger: string;
      };
    };
    device: {
      title: string;
      subtext: string;
      tooltip: string;
      actions: {
        confirmOnDevice: string;
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
    };
    loading: {
      title: string;
      subTitle: string;
    };
    success: {
      title: string;
      subtext: string;
    };
  };
  checkout: {
    heading: string;
    payment: {
      title: string;
      subtext: string;
    };
    greeting: {
      title: string;
      subtext: string;
    };
  };
}

interface LangSwap {
  title: string;
  detailsInput: {
    common: {
      searchText: string;
      walletPlaceholder: string;
    };
    from: {
      title: string;
      accountPlaceholder: string;
      amountLabel: string;
      amountError: string;
    };
    to: {
      title: string;
      accountPlaceholder: string;
      amountLabel: string;
    };
    offers: {
      title: string;
      initialText: string;
      searchingForOffers: string;
      bestOffer: string;
      fixedRate: string;
      fixedRateTooltip: string;
      networkFee: string;
      networkFeeTooltip: string;
      quotesFound: string;
      timerText: string;
      buttons: {
        continue: string;
      };
      errors: {
        sameAsset: string;
        noOffers: string;
        currencyNotSupported: string;
        amountRange: string;
        noQuotes: string;
        noInternet: string;
        enterAmount: string;
        selectDifferentCoinPair: string;
      };
    };
  };
  topBar: {
    history: string;
  };
  swapReceive: {
    errors: {
      notSuccessful: string;
      invalidInputs: string;
      accountNotSelected: string;
    };
  };
  swapSend: {
    errors: {
      notSuccessfull: string;
      cannotStart: string;
      invalidPrerequisite: string;
    };
  };
  swapSummary: {
    heading: string;
    from: string;
    to: string;
    amount: string;
    provider: string;
    networkFee: string;
    totalToDebit: string;
  };
  swapStatus: {
    heading: {
      success: string;
      pending: string;
      failed: string;
    };
    description: string;
    amountSent: string;
    amountReceived: string;
    transactionID: string;
    messageBox: {
      warning: string;
      danger: string;
    };
    button: {
      backToSwap: string;
    };
  };
  commonErrors: {
    timeout: {
      title: string;
      description: string;
    };
  };
}
