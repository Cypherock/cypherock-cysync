// import {
//   DialogBoxBody,
//   InputLabel,
//   LangDisplay,
//   LeanBox,
//   LeanBoxContainer,
//   bitcoinIcon,
// } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { openAddAccountDialog } from '~/actions';
import {
  AddAccountDialog,
  AddAccountSingleChainDialog,
} from '~/dialogs/AddAccountGuide/Dialogs';
import { useAppDispatch } from '~/store';

export const SyncAccount: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openAddAccountDialog());
  }, []);

  // const [checkedAccounts, setCheckedAccounts] = useState<
  //   Record<string, boolean>
  // >({});

  // const handleCheckChange = (id: string) => (isChecked: boolean) => {
  //   setCheckedAccounts(prevState => ({
  //     ...prevState,
  //     [id]: isChecked,
  //   }));
  // };

  // const handleUncheckAll = () => {
  //   setCheckedAccounts({});
  // };

  return (
    <div>
      {/* <SelectCryptoDialog /> */}
      <AddAccountDialog />
      <AddAccountSingleChainDialog />
      {/* <InitialiseAccountDialog /> */}
      {/* <DialogBoxBody>
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
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              text={data.text}
              id={data.id}
              animate={data.animate}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody> */}
    </div>
  );
};
