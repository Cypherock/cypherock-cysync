import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  svgGradients, // This object should have 'gold' and 'odixPrimary' keys
  ArrowReceivedIcon,
} from '@cypherock/cysync-ui';
import React, { useCallback, useMemo } from 'react'; // Added useMemo

import { selectAccounts, selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { useReceiveDialog } from '../context';

export const SelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    onNext,
    selectedAccount,
    selectedWallet,
    handleAccountChange,
    handleWalletChange,
    walletDropdownList,
    accountDropdownList,
    defaultWalletId,
    defaultAccountId,
  } = useReceiveDialog();

  const dialogText = lang.strings.receive.source;
  const buttonText = lang.strings.buttons;
  const { accounts: allAccounts } = useAppSelector(selectAccounts);

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: `Receive/${SelectionDialog.name}`,
        isWalletSelected: Boolean(args[0]),
      });
      return handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleAccountChangeProxy: typeof handleAccountChange = useCallback(
    (id: string | undefined, ...args) => {
      const targetAccount = allAccounts.find(a => a.__id === id);
      logger.info('Dropdown Change: Account Change', {
        source: `Receive/${SelectionDialog.name}`,
        assetId: targetAccount?.assetId,
        derivationPath: targetAccount?.derivationPath,
      });
      return handleAccountChange(id, ...args);
    },
    [allAccounts, handleAccountChange],
  );

  // Determine the icon fill based on the vendor
  const iconFillGradientId = useMemo(() => {
    const isOdix =
      typeof window !== 'undefined' &&
      (window as any).cysyncEnv?.VENDOR === 'odix';
    // Ensure svgGradients.odixPrimary exists, otherwise fallback to gold
    // This check is good if svgGradients might not always have odixPrimary
    const odixGradient = svgGradients.odixPrimary ?? svgGradients.gold;
    return isOdix ? odixGradient : svgGradients.gold;
  }, []); // Empty dependency array as VENDOR is unlikely to change during component lifecycle

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <ArrowReceivedIcon
          height={48}
          width={56}
          fill={`url(#${iconFillGradientId})`} // Use the conditional gradient ID
        />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={dialogText.title} />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            $fontSize={14}
            $fontWeight="normal"
            color="muted"
          >
            <LangDisplay text={dialogText.subtitle} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={dialogText.searchText}
            placeholderText={dialogText.walletPlaceholder}
            onChange={handleWalletChangeProxy}
            autoFocus={!defaultWalletId}
            noLeftImageInList
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText={dialogText.searchText}
            placeholderText={dialogText.accountPlaceholder}
            onChange={handleAccountChangeProxy}
            autoFocus={Boolean(defaultWalletId) && !defaultAccountId}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!selectedAccount || !selectedWallet}
          autoFocus={Boolean(defaultWalletId) && Boolean(defaultAccountId)}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={buttonText.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
