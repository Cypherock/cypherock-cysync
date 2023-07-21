import {
  DialogBoxBody,
  InputLabel,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  bitcoinIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';
import { openSendGuideDialog } from '~/actions';
import { ConnectDevice } from '~/dialogs/AddAccountGuide/Dialogs';
import { DeniedOnDevice } from '~/dialogs/SendGuide/Dialogs/DeniedOnDevice';
import { LoadingDialog } from '~/dialogs/SendGuide/Dialogs/LoadingDialog';
import { SelectSend } from '~/dialogs/SendGuide/Dialogs/SelectSend';
import { SendConfirmToken } from '~/dialogs/SendGuide/Dialogs/SendConfirmToken';
import { SendDone } from '~/dialogs/SendGuide/Dialogs/SendDone';
import { SendProblem } from '~/dialogs/SendGuide/Dialogs/SendProblem';
import { SummaryDialog } from '~/dialogs/SendGuide/Dialogs/SummaryDialog';
import { SummaryScrollDialog } from '~/dialogs/SendGuide/Dialogs/SummaryScrollDialog';

import { useAppDispatch } from '~/store';

export const SyncAccount: React.FC = () => {
  const dispatch = useAppDispatch();

  const accountNotSynced = [
    {
      id: '1',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 2',
      checkBox: true,
      tag: 'TAPROOT',
    },
    {
      id: '22',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 2',
      checkBox: true,
      tag: 'TAPROOT',
    },
    {
      id: '3',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 2',
      checkBox: true,
      tag: 'SEGWIT',
    },
    {
      id: '4',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 2',
      checkBox: true,
      tag: 'NATIVE SEGWIT',
    },
  ];

  useEffect(() => {
    dispatch(openSendGuideDialog());
  }, []);

  const [checkedAccounts, setCheckedAccounts] = useState<
    Record<string, boolean>
  >({});

  const handleCheckChange = (id: string, isChecked: boolean) => {
    setCheckedAccounts(prevState => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

  const handleUncheckAll = () => {
    setCheckedAccounts({});
  };

  return (
    <div>
      <DialogBoxBody>
        <InputLabel
          color="gold"
          display={{ def: 'inline-block' }}
          fontSize={14}
          pl={1}
          mt={2}
          mr={1}
          mb={1}
          noWrap
          textAlign="right"
          onClick={handleUncheckAll}
          clickable
        >
          <LangDisplay text="UncheckAll" />
        </InputLabel>
        <LeanBoxContainer>
          {accountNotSynced.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              text={data.text}
              tag={data.tag}
              checkBox={data.checkBox}
              id={data.id}
              onCheckChange={(isChecked: boolean) =>
                handleCheckChange(data.id, isChecked)
              }
              isChecked={checkedAccounts[data.id] || false}
            />
          ))}
        </LeanBoxContainer>
        <SummaryDialog />
        <SummaryScrollDialog />
        <LoadingDialog />
        <SendProblem />
        <ConnectDevice />
        <SendConfirmToken />
        <SendDone />
        <DeniedOnDevice />
        <SelectSend />
      </DialogBoxBody>
    </div>
  );
};
