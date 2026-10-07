export type SolEverstakeMode = 'stake' | 'unstake' | 'claim';

export type SolEverstakeStep =
  | 'consent'
  | 'stakeInput'
  | 'stakeReview'
  | 'staking'
  | 'stakeDone'
  | 'unstakeInfo'
  | 'unstakeInput'
  | 'unstakeReview'
  | 'unstaking'
  | 'unstakeDone'
  | 'claimInfo'
  | 'claimReview'
  | 'claiming'
  | 'claimDone'
  | 'error';

export const SOL_SIGNING_STEPS: SolEverstakeStep[] = [
  'staking',
  'unstaking',
  'claiming',
];

export const SOL_MIN_STAKE_AMOUNT = '1';
export const SOL_MIN_SPLIT_REMAINDER = '0.01';
export const LAMPORTS_PER_SOL = '1000000000';
