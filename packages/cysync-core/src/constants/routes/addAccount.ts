export const addAccount = {
  add: {
    name: 'addAccount-add',
    path: '/addAccount/add',
  },
  sync: {
    name: 'addAccount-sync',
    path: '/addAccount/sync',
  },
  noAccount: {
    name: 'addAccount-noAccount',
    path: '/addAccount/noAccount',
  },
} as const;

export type addAccountRouteName =
  (typeof addAccount)[keyof typeof addAccount]['name'];
