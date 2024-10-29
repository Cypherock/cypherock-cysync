import { InheritanceApp } from '@cypherock/sdk-app-inheritance';
import { Observable } from 'rxjs';

import {
  IInheritanceStartSessionEvent,
  IInheritanceStartSessionParams,
} from './types';

import logger from '../../utils/logger';

export const startSession = (
  params: IInheritanceStartSessionParams,
): Observable<IInheritanceStartSessionEvent> =>
  new Observable<IInheritanceStartSessionEvent>(observer => {
    let finished = false;
    let app: InheritanceApp | undefined;

    const cleanUp = async () => {
      if (app) {
        try {
          await app.abort();
        } catch (error) {
          logger.warn('Error in aborting inheritance start session');
          logger.warn(error);
        }
      }
    };

    const unsubscribe = () => {
      if (!finished) {
        finished = true;
        cleanUp();
      }
    };

    const main = async () => {
      try {
        const { connection } = params;
        app = await InheritanceApp.create(connection);

        const { sessionId, sessionAge } = await app.startSession();
        observer.next({ type: 'Device', device: { isDone: true } });
        observer.next({
          type: 'Result',
          sessionId,
          sessionAge,
        });

        finished = true;
        observer.complete();
      } catch (error) {
        if (!finished) {
          observer.error(error);
        }
      }
    };

    main();

    return unsubscribe;
  });
