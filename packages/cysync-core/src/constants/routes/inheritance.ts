export const inheritance = {
  home: {
    name: 'inheritance',
    path: '/inheritance',
  },
  choosePlan: {
    name: 'inheritance-choose-plan',
    path: '/inheritance/plans',
  },
  planDetails: {
    name: 'inheritance-plan-details',
    path: '/inheritance/plan',
  },
} as const;

export type InheritanceRouteName =
  (typeof inheritance)[keyof typeof inheritance]['name'];
