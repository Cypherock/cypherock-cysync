import {
  DialogBoxBody,
  InputLabel,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  bitcoinIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';
import { openAddAccountGuideDialog } from '~/actions';
import {
  AddAccountSingleChainDialog,
  InitialiseAccountDialog,
} from '~/dialogs/AddAccountGuide/Dialogs';

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
    dispatch(openAddAccountGuideDialog());
  }, []);

  const [checkedAccounts, setCheckedAccounts] = useState<
    Record<string, boolean>
  >({});

  const handleCheckChange = (id: string) => (isChecked: boolean) => {
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
      <AddAccountSingleChainDialog />
      <InitialiseAccountDialog />
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
              onCheckChange={handleCheckChange(data.id)}
              isChecked={checkedAccounts[data.id] || false}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </div>
  );
};
