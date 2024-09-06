import { IDatabase, IInheritancePlan } from '@cypherock/db-interfaces';

export const insertInheritancePlan = async (
  db: IDatabase,
  plan: Omit<IInheritancePlan, '__id'>,
) => {
  const existingPlan = await db.inheritancePlan.getOne({
    __id: plan.walletId,
  });

  if (existingPlan) {
    await db.inheritancePlan.update(
      {
        __id: plan.walletId,
      },
      {
        ...plan,
      },
    );
  } else {
    await db.inheritancePlan.insert({
      __id: plan.walletId,
      ...plan,
    });
  }
};
