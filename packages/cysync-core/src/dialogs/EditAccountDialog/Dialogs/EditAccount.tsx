import { getAsset } from '@cypherock/coin-support-utils';
import { IEvmErc20Token } from '@cypherock/coins';
import {
  Button,
  Dropdown,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  CloseButton,
  Input,
  Flex,
  Divider,
  ScrollableContainer,
  EditAccountIcon,
  ArrowDown,
  ArrowUp,
  MessageBox,
  Container,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { CoinIcon } from '~/components/CoinIcon';
import {
  openSnackBar,
  useAppDispatch,
  selectLanguage,
  useAppSelector,
} from '~/store';

import { useEditAccountDialog } from '../context';

export const EditAccount: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    onClose,
    handleApply,
    isLoading,
    selectedAccount,
    selectedWallet,
    selectedWalletType,
    selectedWalletName,
    accountList,
    walletList,
    walletType,
    handleAccountSelect,
    handleWalletChange,
    handleWalletTypeChange,
    handleWalletNameChange,
    isContinueDisabled,
    isApplyDisabled,
  } = useEditAccountDialog();
  const [tab, setTab] = useState(1);
  const { strings } = useAppSelector(selectLanguage);
  const { dialogs } = strings;
  const tabFirst = dialogs.editAccount.tab1;
  const tabSecond = dialogs.editAccount.tab2;
  const tabThird = dialogs.editAccount.tab3;
  const handleGetAssets = () => {
    const tempAccount = accountList.filter(e => e.__id === selectedAccount)[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const asset = getAsset(
      tempAccount.parentAssetId,
      tempAccount.assetId,
    ) as IEvmErc20Token;
  };

  useEffect(() => {
    if (window.location.hash.includes('#/account?accountId')) {
      setTab(2);
    }
  }, [window.location.hash]);

  const [showAdvance, setShowAdvance] = useState(false);
  const showIcon = false;
  const showQuestionmark = true;

  // this will be removed and replaced with dynamic value from API
  const message1 =
    'This is a native segwit xpub. When importing it into a third-party wallet,  choose the same derivation mode';

  // this will be removed and replaced with dynamic value from API
  const message2 = `"xpub": "tpubDCzetagUBW9jcbtJkAP4hpPkTCPa
  G2QMWrSJZMXUP16j7H13Ce1NtAtstH4HffnERjJUcVY6CbYs5cV6Keyge5Q
  2SuitSd2CXrKoVbMyHX1", "index": 0, "freshAddressPath":
  "84'/1'/0'/0/2","id": "js:2:bitcoin_testnet:tpubDCzetag
  UBW9jcbtJkAP4hpPkTCPaG2QMWrSJZMXUP16j7H13Ce1NtAtstH4HffnERj
  JUcVY6CbYs5cV6Keyge5Q2SuitSd2CXrKoVbMyHX1:native_segwit",
  "blockHeight": 2410257 }`;

  return (
    <DialogBox
      width={tab === 2 ? 700 : 500}
      $maxHeight="90vh"
      align="stretch"
      gap={0}
      onClose={onClose}
    >
      <Flex direction="row" justify="flex-end" py={2} px={3}>
        <CloseButton onClick={onClose} />
      </Flex>
      <Divider variant="horizontal" />
      <ScrollableContainer>
        <DialogBoxBody gap={0} p={0} align="stretch">
          {tab <= 2 && (
            <>
              <center>
                <EditAccountIcon top={20} position="relative" />
              </center>
              <Flex px={5} py={4} gap={4} direction="column" align="center">
                <Typography $fontSize={20} color="white">
                  <LangDisplay
                    text={tab === 1 ? tabFirst.title : tabSecond.title}
                  />
                </Typography>
                <Typography $fontSize={16} color="muted">
                  <LangDisplay
                    text={tab === 1 ? tabFirst.subtitle : tabSecond.subtitle}
                  />
                </Typography>
              </Flex>
            </>
          )}
          <Flex
            gap={24}
            px={5}
            pt={2}
            pb={4}
            direction="column"
            align="stretch"
          >
            {tab === 1 && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                }}
                id="edit-account-form"
              >
                <Flex bottom={24} position="relative">
                  <Container
                    display="flex"
                    direction="column"
                    gap={20}
                    width="full"
                  >
                    <Dropdown
                      items={accountList.map(item => ({
                        id: item.__id,
                        leftImage: (
                          <CoinIcon parentAssetId={item.parentAssetId} />
                        ),
                        text: item.name,
                      }))}
                      searchText="Search Account"
                      placeholderText="Select Account"
                      onChange={val => (val ? handleAccountSelect(val) : '')}
                      selectedItem={selectedAccount}
                    />
                  </Container>
                </Flex>
                <Container
                  display="flex"
                  direction="column"
                  gap={20}
                  width="full"
                >
                  <Dropdown
                    items={walletList.map(item => ({
                      id: item.__id,
                      rightText: `${item.balance} ${item.abbr}`,
                      leftImage: (
                        <img
                          height="20px"
                          width="25px"
                          src={item.image}
                          alt=""
                        />
                      ),
                      text: `${item.name} (${item.abbr} )`,
                    }))}
                    searchText="Search Wallet"
                    placeholderText="Select Wallet"
                    onChange={val => (val ? handleWalletChange(val) : '')}
                    selectedItem={selectedWallet}
                  />
                </Container>
              </form>
            )}
            {tab === 2 && (
              <Flex p={1} direction="column">
                <Flex justify="space-between" p={1}>
                  <Flex direction="column">
                    <Typography $fontSize={18} color="white" $textAlign="left">
                      <LangDisplay text={tabSecond.input.first.title} />
                    </Typography>
                    <Typography $fontSize={14} color="muted" $textAlign="left">
                      <LangDisplay text={tabSecond.input.first.subtitle} />
                    </Typography>
                  </Flex>
                  <Flex width={294}>
                    <Input
                      pasteAllowed
                      name="walletName"
                      value={selectedWalletName}
                      onChange={handleWalletNameChange}
                      type="text"
                    />
                  </Flex>
                </Flex>
                <Divider variant="horizontal" />
                <Flex justify="space-between" p={1}>
                  <div>
                    <Typography $fontSize={18} color="white">
                      <LangDisplay text={tabSecond.input.second.title} />
                    </Typography>
                    <Typography $fontSize={14} color="muted">
                      <LangDisplay text={tabSecond.input.second.subtitle} />
                    </Typography>
                  </div>
                  <Flex width={294}>
                    <Dropdown
                      items={walletType.map(item => ({
                        id: item.__id,
                        text: item.name,
                      }))}
                      searchText="Search Wallet"
                      placeholderText="Select Wallet"
                      onChange={val => (val ? handleWalletTypeChange(val) : '')}
                      selectedItem={selectedWalletType}
                    />
                  </Flex>
                </Flex>
                <Divider variant="horizontal" />
                <Flex justify="space-between" p={1} my={1} align="center">
                  <Typography $fontSize={18} color="white">
                    <LangDisplay text="Advanced" />
                  </Typography>
                  {showAdvance ? (
                    <ArrowUp
                      cursor="pointer"
                      onClick={() => setShowAdvance(!showAdvance)}
                    />
                  ) : (
                    <ArrowDown
                      cursor="pointer"
                      onClick={() => setShowAdvance(!showAdvance)}
                    />
                  )}
                </Flex>
                {showAdvance && (
                  <>
                    <MessageBox
                      type="info"
                      showQuestionmark={showQuestionmark}
                      text={message1}
                    />
                    <Flex top={20} position="relative">
                      <MessageBox
                        type="info"
                        showIcon={showIcon}
                        text={message2}
                      />
                    </Flex>
                  </>
                )}
                <Divider variant="horizontal" />
              </Flex>
            )}
            {tab === 3 && (
              <>
                <center>
                  <img
                    height="50px"
                    width="50px"
                    src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/06/solana_logo.jpeg.jpg"
                    alt=""
                    style={{ marginBottom: '15px', marginTop: '10px' }}
                  />
                </center>
                <Typography $fontSize={18} color="white" $textAlign="center">
                  <LangDisplay text={tabThird.title} />
                </Typography>
                <Typography $fontSize={14} color="muted" $textAlign="center">
                  <LangDisplay text={tabThird.subtitle} />
                </Typography>
              </>
            )}
          </Flex>
        </DialogBoxBody>
        <DialogBoxFooter>
          {tab === 1 && (
            <Button
              variant="primary"
              disabled={!isContinueDisabled}
              onClick={e => {
                e.preventDefault();
                setTab(2);
                handleGetAssets();
              }}
            >
              <LangDisplay text={tabFirst.btn} />
            </Button>
          )}
          {tab === 2 && (
            <>
              <Button
                variant="danger"
                disabled={isLoading}
                onClick={e => {
                  e.preventDefault();
                  setTab(3);
                }}
              >
                <LangDisplay text={tabSecond.btn.primary.text} />
              </Button>
              <Button
                variant="primary"
                disabled={!isApplyDisabled}
                isLoading={isLoading}
                onClick={async e => {
                  e.preventDefault();
                  await handleApply();
                }}
              >
                <LangDisplay text={tabSecond.btn.secondary.text} />
              </Button>
            </>
          )}
          {tab === 3 && (
            <>
              <Button
                variant="danger"
                disabled={isLoading}
                onClick={e => {
                  e.preventDefault();
                  onClose();
                  dispatch(
                    openSnackBar({
                      icon: 'check',
                      text: 'Solona 1 removed from the portfolio',
                      buttonText: 'Close',
                    }),
                  );
                }}
              >
                <LangDisplay text={tabThird.btn.primary} />
              </Button>
              <Button
                variant="primary"
                disabled={isLoading}
                onClick={e => {
                  e.preventDefault();
                  setTab(2);
                }}
              >
                <LangDisplay text={tabThird.btn.secondary} />
              </Button>
            </>
          )}
        </DialogBoxFooter>
      </ScrollableContainer>
    </DialogBox>
  );
};
