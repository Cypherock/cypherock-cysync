import { ManagerApp } from '@cypherock/sdk-app-manager';

import { Spinner } from '~/utils';

export const authCard = async (params: {
  app: ManagerApp;
  cardNumber: number;
  isPairRequired?: boolean;
}) => {
  const name = 'Authenticating Card';

  const { app, cardNumber, isPairRequired } = params;
  const spinner = await Spinner.create(name);

  try {
    await app.authCard({ cardNumber, isPairRequired });
    spinner.succeed();
  } catch (error) {
    spinner.fail();
    throw error;
  }
};

export const authAllCards = async (params: {
  app: ManagerApp;
  isPairRequired?: boolean;
}) => {
  const name = 'Authenticating Cards';

  const { app, isPairRequired } = params;
  let sessionId: string | undefined;

  const spinner = await Spinner.create(name);

  try {
    for (const cardNumber of [1, 2, 3, 4]) {
      spinner.updateText(`${name} (#${cardNumber})`);
      const result = await app.authCard({
        cardNumber,
        isPairRequired,
        sessionId,
      });
      sessionId = result.sessionId;
    }

    spinner.succeed(name);
  } catch (error) {
    spinner.fail();
    throw error;
  }
};
