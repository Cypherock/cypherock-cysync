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
  ArrowRightIcon,
  Input,
  Flex,
  Divider,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { useState } from 'react';

import { CoinIcon } from '~/components/CoinIcon';
import {
  selectUnHiddenAccounts,
  selectWallets,
  openSnackBar,
  useAppDispatch,
  selectLanguage,
  useAppSelector,
} from '~/store';

import { useEditAccountDialog } from '../context';

const selector = createSelector(
  [selectUnHiddenAccounts, selectWallets, selectLanguage],
  ({ accounts }, { wallets }, lang) => ({ accounts, wallets, lang }),
);

export const EditAccount: React.FC = () => {
  const { accounts, wallets, lang } = useAppSelector(selector);
  console.log('account data', accounts, wallets, lang);
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
  let asset;
  const handleGetAssets = () => {
    const tempAccount = accountList.filter(e => e.__id === selectedAccount)[0];
    asset = getAsset(
      tempAccount.parentAssetId,
      tempAccount.assetId,
    ) as IEvmErc20Token;
  };
  console.log(asset);

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
                <img
                  height="60px"
                  width="40px"
                  src="https://as1.ftcdn.net/v2/jpg/02/22/70/10/1000_F_222701046_Sy6YusoW0rBK3eMUImKMA8Bi53qEZ3pr.jpg"
                  alt=""
                  style={{ marginTop: '20px' }}
                />
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
                <div style={{ marginBottom: '24px' }}>
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
                </div>
                <Dropdown
                  items={walletList.map(item => ({
                    id: item.__id,
                    rightText: `${item.balance} ${item.abbr}`,
                    leftImage: (
                      <img height="20px" width="25px" src={item.image} alt="" />
                    ),
                    text: `${item.name} (${item.abbr} )`,
                  }))}
                  searchText="Search Wallet"
                  placeholderText="Select Wallet"
                  onChange={val => (val ? handleWalletChange(val) : '')}
                  selectedItem={selectedWallet}
                />
              </form>
            )}
            {tab === 2 && (
              <div style={{ color: 'white', padding: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <Typography $fontSize={18} color="white">
                      <LangDisplay text={tabSecond.input.first.title} />
                    </Typography>
                    <Typography $fontSize={14} color="muted">
                      <LangDisplay text={tabSecond.input.first.subtitle} />
                    </Typography>
                  </div>
                  <div style={{ width: '30%' }}>
                    <Input
                      pasteAllowed
                      name="walletName"
                      value={selectedWalletName}
                      onChange={handleWalletNameChange}
                      type="text"
                    />
                  </div>
                </div>
                <Divider variant="horizontal" />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                  }}
                >
                  <div>
                    <Typography $fontSize={18} color="white">
                      <LangDisplay text={tabSecond.input.second.title} />
                    </Typography>
                    <Typography $fontSize={14} color="muted">
                      <LangDisplay text={tabSecond.input.second.subtitle} />
                    </Typography>
                  </div>
                  <div style={{ width: '30%' }}>
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
                  </div>
                </div>
                <Divider variant="horizontal" />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    marginTop: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <Typography $fontSize={18} color="white">
                    <LangDisplay text="Advanced" />
                  </Typography>
                  <div>
                    <ArrowRightIcon />
                  </div>
                </div>
                <Divider variant="horizontal" />
              </div>
            )}
            {tab === 3 && (
              <div style={{ color: 'white' }}>
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
              </div>
            )}
          </Flex>
        </DialogBoxBody>
      </ScrollableContainer>
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
    </DialogBox>
  );
};
