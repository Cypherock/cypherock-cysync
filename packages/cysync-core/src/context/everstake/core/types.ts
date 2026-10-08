export type EverstakeMode =
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'claimRewards'
  | 'claimUnstake'
  | 'restake';

export type EverstakeStep =
  | 'consent'
  | 'stakeInput'
  // POL only: fee review, signing, and confirmation-polling for the ERC20
  // approve txn, inserted between stakeInput and stakeFee when allowance is
  // insufficient.
  | 'approveFee'
  | 'approving'
  | 'confirmingApprove'
  | 'stakeFee'
  | 'staking'
  | 'stakeDone'
  | 'unstakeInfo'
  | 'unstakeInput'
  | 'unstakeFee'
  | 'unstaking'
  | 'unstakeDone'
  | 'claimInfo'
  | 'claimFee'
  | 'claimConfirm'
  | 'claiming'
  | 'claimDone'
  | 'error';

export const SIGNING_STEPS: EverstakeStep[] = [
  'approving',
  'staking',
  'unstaking',
  'claiming',
];

export const CLAIM_LIKE_MODES: EverstakeMode[] = [
  'claim',
  'claimRewards',
  'claimUnstake',
  'restake',
];

export const APPROVE_CONFIRM_POLL_INTERVAL_MS = 5000;
export const APPROVE_CONFIRM_SOFT_TIMEOUT_MS = 120000;
