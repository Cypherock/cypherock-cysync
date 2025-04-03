import {
  BinanceConnet,
  cysyncLogoSmall,
  DashedLineEndCircled,
  DialogBox,
  DialogBoxBody,
  Container,
  LangDisplay,
  DialogBoxFooter,
  Button,
  Flex,
  Image,
  Dropdown,
  DropDownItemProps,
  Input,
  InputLabel,
  Typography,
  addKeyboardEvents,
} from '@cypherock/cysync-ui';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { openReceiveDialog, openSendDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { useAccountDropdown } from '~/hooks';

import {
  useAppSelector,
  selectLanguage,
  useAppDispatch,
  selectUnHiddenAccounts,
} from '~/store';

export const SwapDetailsInput = () => {
  const { accounts } = useAppSelector(selectUnHiddenAccounts);
  const { accountDropdownList } = useAccountDropdown({
    selectedWallet: undefined,
  });
  const [selectedFromAccount, setSelectedFromAccount] =
    useState<DropDownItemProps>();
  const [selectedToAccount, setSelectedToAccount] =
    useState<DropDownItemProps>();
  const [inputAmount, setInputAmount] = useState(0);
  const outputAmount = useMemo(() => inputAmount * 0.89, [inputAmount]);
  const providerAmount = useMemo(
    () => Math.floor(inputAmount) % 5,
    [inputAmount],
  );

  const [isLoading, setIsLoading] = useState(false);
  const timeoutId = useRef<any>();

  const dispatch = useAppDispatch();
  const [isFlowOver, setIsFlowOver] = useState(false);

  const openSend = useCallback(() => {
    const obj = {
      walletId:
        'aa8d9298a7fa34993d8ca650cb80048ebe86f1b47dd8a5bb89a03dc9c37c674e',
      accountId: 'ad844c98-5fa5-4469-ad39-46d57928989e',
    };
    dispatch(openSendDialog({ ...obj, skipAccountSelection: true }));
  }, [dispatch, selectedFromAccount, accounts]);

  addKeyboardEvents({
    x: openSend,
  });

  if (isFlowOver) return <LoaderDialog />;

  return (
    <DialogBox width={700}>
      <DialogBoxBody p={0} pt={4} gap={0}>
        <Container
          display="flex"
          direction="column"
          px={5}
          pt={2}
          pb={4}
          gap={24}
          width="100%"
        >
          <Flex direction={'column'} gap={4}>
            <Typography variant="span" color="muted" $fontSize={13}>
              <LangDisplay text={'From'} />
            </Typography>
            <Flex gap={8}>
              <Dropdown
                items={accountDropdownList}
                selectedItem={selectedFromAccount?.id}
                searchText={'Search text'}
                placeholderText={'Select Account'}
                onChange={(id?: string) => {
                  setSelectedFromAccount(
                    accountDropdownList.find(obj => obj.id === id),
                  );
                }}
              />
              <Input
                type={'text'}
                name={'somethign'}
                value={inputAmount.toString()}
                onChange={val => {
                  setInputAmount(parseFloat(val) || 0);
                  setIsLoading(true);
                  if (timeoutId.current) {
                    clearTimeout(timeoutId.current);
                    timeoutId.current = undefined;
                  }
                  timeoutId.current = setTimeout(
                    () => setIsLoading(false),
                    2000,
                  );
                }}
              />
            </Flex>
          </Flex>
          <Flex direction={'column'} gap={4}>
            <Typography variant="span" color="muted" $fontSize={13}>
              <LangDisplay text={'To'} />
            </Typography>
            <Flex gap={8}>
              <Dropdown
                items={accountDropdownList}
                selectedItem={selectedToAccount?.id}
                searchText={'Search text'}
                placeholderText={'Select Account'}
                onChange={(id?: string) => {
                  setSelectedToAccount(
                    accountDropdownList.find(obj => obj.id === id),
                  );
                }}
              />
              <Input
                type={'text'}
                name={'somethign'}
                value={outputAmount.toString()}
              />
            </Flex>
          </Flex>
          <Flex gap={8} direction="column">
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              Array(providerAmount)
                .fill(0)
                .map((_, index) => {
                  return (
                    <Container
                      key={index}
                      $bgColor={'slateDark'}
                      width={'80%'}
                      p={2}
                    >
                      <Typography>
                        Random Coin provider (selectable)
                        <br />
                        can show info like exchange rate and fees
                      </Typography>
                    </Container>
                  );
                })
            )}
          </Flex>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="primary"
          onClick={() => {
            setIsFlowOver(true);

            setTimeout(() => {
              const obj = {
                walletId: accounts.find(
                  account => account.__id === selectedToAccount?.id,
                )?.walletId,
                accountId: selectedToAccount?.id,
              };
              console.log({ obj });

              dispatch(openReceiveDialog(obj));
            }, 600);
          }}
        >
          <LangDisplay text={'Swap'} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
