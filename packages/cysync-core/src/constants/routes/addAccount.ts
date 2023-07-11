export const addAccount = {
  sync: {
    name: 'addAccount-sync',
    path: '/addAccount/sync',
  },
} as const;

export type addAccountRouteName =
  (typeof addAccount)[keyof typeof addAccount]['name'];
