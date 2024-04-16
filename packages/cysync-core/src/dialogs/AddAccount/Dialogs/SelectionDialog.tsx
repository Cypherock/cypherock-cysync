import { coinList } from '@cypherock/coins';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DropDownItemProps,
  Dropdown,
  Image,
  LangDisplay,
  Typography,
  addAccountIcon,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { CoinIcon } from '~/components/CoinIcon';
import { selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { useAddAccountDialog } from '../context';

const coinDropDownList: DropDownItemProps[] = Object.values(coinList)
  .filter(
    c => window.cysyncEnv.IS_PRODUCTION === 'false' || !c.isUnderDevelopment,
  )
  .map(coin => ({
    id: coin.id,
    leftImage: <CoinIcon parentAssetId={coin.id} />,
    shortForm: `(${coin.abbr.toUpperCase()})`,
    text: coin.name,
    checkType: 'radio',
  }));

export const AddAccountSelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onNext,
    selectedCoin,
    selectedWallet,
    setSelectedCoin,
    handleWalletChange,
    walletDropdownList,
    defaultWalletId,
  } = useAddAccountDialog();

  const strings = lang.strings.addAccount.select;
  const button = lang.strings.buttons;

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: AddAccountSelectionDialog.name,
        isWalletSelected: Boolean(args[0]),
      });
      handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleCoinChange = useCallback(
    (id: string | undefined) => {
      const targetCoin = id ? coinList[id] : undefined;
      setSelectedCoin(targetCoin);
      logger.info('Dropdown Change: Coin Change', {
        source: AddAccountSelectionDialog.name,
        coin: targetCoin?.name,
      });
    },
    [coinList],
  );

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={addAccountIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={strings.header} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={strings.searchText}
            placeholderText={strings.walletPlaceholder}
            onChange={handleWalletChangeProxy}
            noLeftImageInList
            autoFocus={!defaultWalletId}
          />
          <Dropdown
            items={coinDropDownList}
            selectedItem={selectedCoin?.id}
            disabled={!selectedWallet}
            searchText={strings.searchText}
            placeholderText={strings.coinPlaceholder}
            onChange={handleCoinChange}
            autoFocus={Boolean(defaultWalletId)}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!selectedCoin || !selectedWallet}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
