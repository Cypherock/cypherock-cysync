import React, { Dispatch, FC, SetStateAction } from 'react';
import { TapX1Cards } from '../Dialogs';

export const SyncX1CardsTab: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState, state }) => {
  if (state === 6) return <TapX1Cards setState={setState} />;
  return null;
};
