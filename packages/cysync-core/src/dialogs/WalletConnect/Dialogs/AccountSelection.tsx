import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  Dropdown,
  AlertBox,
  BulletList,
  ScrollableContainer,
  Flex,
  CloseButton,
  WalletIcon,
  DialogBoxHeader,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useRef } from 'react';

import { useWalletConnect } from '~/context';
import { useStateWithRef, useWalletDropdown } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import {
  ChainSpecificAccountSelection,
  DappConnectionDisplay,
} from './Components';

export const WalletConnectAccountSelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { buttons, walletConnect } = lang.strings;
  const { accountSelectionTab, common } = walletConnect;
  const { selectedWallet, walletDropdownList, handleWalletChange } =
    useWalletDropdown();
  const {
    requiredNamespaces,
    optionalNamespaces,
    handleClose,
    unsupportedOptionalChainsMessage,
    approveSessionRequest,
  } = useWalletConnect();
  const chainToAccountMapRef = useRef<Record<string, IAccount>>({});
  const [isButtonDisabled, setIsButtonDisabled] = useStateWithRef(true);
  const onSubmit = (e: any) => {
    e.preventDefault();
    approveSessionRequest(Object.values(chainToAccountMapRef.current));
  };

  const updateChainToAccountMap = (account: IAccount, chain: string) => {
    chainToAccountMapRef.current[chain] = account;
    setIsButtonDisabled(
      !requiredNamespaces.every(
        namespace => !!chainToAccountMapRef.current[namespace],
      ),
    );
  };

  return (
    <DialogBox width={500} align="stretch">
      <DialogBoxHeader height={56} width={500} px={3}>
        <Flex position="relative" width="full" justify="center" align="center">
          <CloseButton
            onClick={handleClose}
            $alignSelf="end"
            position="absolute"
            top={0.5}
            $translateY={-0.5}
            right={0}
          />
        </Flex>
      </DialogBoxHeader>
      <form onSubmit={onSubmit}>
        <DappConnectionDisplay title={accountSelectionTab.title} />
        <ScrollableContainer $maxHeight="calc(90vh - 400px)">
          <DialogBoxBody pt={2} px={5} pb={4} align="stretch" gap={24}>
            <Dropdown
              items={walletDropdownList}
              selectedItem={selectedWallet?.__id}
              searchText={accountSelectionTab.chooseWallet}
              placeholderText={accountSelectionTab.chooseWallet}
              onChange={handleWalletChange}
              leftImage={<WalletIcon ml={3} />}
            />
            {requiredNamespaces.map(chain => (
              <ChainSpecificAccountSelection
                chain={chain}
                key={chain}
                selectedWallet={selectedWallet}
                updateChainToAccountMap={updateChainToAccountMap}
                asterisk
              />
            ))}
            {optionalNamespaces.map(chain => (
              <ChainSpecificAccountSelection
                chain={chain}
                key={chain}
                selectedWallet={selectedWallet}
                updateChainToAccountMap={updateChainToAccountMap}
              />
            ))}
            {/* <AlertBox
            alert={accountSelectionTab.supportInfo}
            subAlert={supportedNoAccountBlockchain.join(', ')}
            variant="message"
          /> */}
            {unsupportedOptionalChainsMessage && (
              <AlertBox
                alert={accountSelectionTab.notSupportedWarning.title}
                subAlert={unsupportedOptionalChainsMessage}
                variant="messageSecondary"
              />
            )}
            <Typography color="muted">
              <LangDisplay text={common.info.title} />
            </Typography>
            <BulletList
              items={common.info.points}
              variant="success"
              $bgColor={undefined}
              $borderWidth={0}
              px={0}
              py={0}
            />
          </DialogBoxBody>
        </ScrollableContainer>
        <DialogBoxFooter>
          <Button
            variant="secondary"
            onClick={e => {
              e.preventDefault();
              handleClose();
            }}
          >
            <LangDisplay text={buttons.reject} />
          </Button>
          <Button variant="primary" disabled={isButtonDisabled} type="submit">
            <LangDisplay text={buttons.connect} />
          </Button>
        </DialogBoxFooter>
      </form>
    </DialogBox>
  );
};
