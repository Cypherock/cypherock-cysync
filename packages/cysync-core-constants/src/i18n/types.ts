import { DeviceErrorCodes, IErrorMsg, ServerErrorType } from '../types';

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
  otp: LangOTP;
  inheritance: LangInheritance;
  inheritanceSilverPlanPurchase: LangInheritanceSilverPlanPurchase;
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
    pendingTime: string;
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
    title: { prefix: string; suffix: string };
    addressLabel: string;
    actions: { verify: string };
    messageBox: { warning: string };
  };
  congrats: { title: string };
  finalButtons: {
    secondary: string;
    secondaryUnverified: string;
    primary: string;
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
    };
    fees: { title: string; label: string };
    warning: string;
    feeError: string;
    notEnoughBalance: string;
    toggleText: { replace: string; unconfirmed: string };
    infoBox: string;
    addButton: string;
    remarks: { label: string; placeholder: string; error: string };
  };
  summary: {
    title: string;
    from: string;
    to: string;
    amount: string;
    network: string;
    debit: string;
    remarks: string;
  };
  finalMessage: {
    button: string;
    title: string;
    hashLabel: string;
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
  };
  optimism: {
    deviceAction: string;
    l1: string;
    l2: string;
    suffix: string;
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
    description: string;
    feePrefix: { optimism: string };
    remarks: string;
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
  tutorial: string;
  settings: string;
  help: string;
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

interface LangErrors {
  deviceErrors: Record<DeviceErrorCodes, IErrorMsg>;
  databaseError: IErrorMsg;
  serverErrors: Record<ServerErrorType, IErrorMsg>;
  default: string;
}

interface LangValidation {
  generic: { required: string };
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
      actions: {
        tapCard: string;
      };
      messageBox: {
        warning: string;
      };
    };
    fetchData: {
      title: string;
      subTitle: string;
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
          enterPinAndTapCard: string;
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
      actions: {
        viewDevice: string;
      };
    };
    success: {
      name: string;
      title: string;
    };
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
}

interface LangInheritance {
  title: string;
  choosePlan: {
    title: string;
  };
  buttons: {
    syncPlans: string;
    recoverPin: string;
  };
  termsOfService: {
    title: string;
    privacyPolicy: string;
    checkBoxLabel: string;
  };
  dialog: {
    userDetails: {
      form: {
        name: string;
        email: string;
        alternateEmail: string;
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
  };
}

interface LangInheritanceSilverPlanPurchase {
  title: string;
  ensure: {
    title: string;
    instructions: string[];
  };
  instructions: {
    heading: string;
    title: string;
    subTitle: string;
  };
  selectWallet: {
    heading: string;
    title: string;
    subTitle: string;
  };
  walletAuth: {
    heading: string;
    title: string;
    actions: {
      tapCard: string;
    };
    footer: string;
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
      actions: {
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
    };
  };
}
