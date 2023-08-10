import { coinList } from '@cypherock/coins';
import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  addIcon,
  DropDownListItemProps,
} from '@cypherock/cysync-ui';
import React from 'react';

import { CoinIcon } from '~/components/CoinIcon';
import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../context';

const coinDropDownList: DropDownListItemProps[] = Object.values(coinList).map(
  coin => ({
    id: coin.id,
    leftImage: <CoinIcon assetId={coin.id} />,
    shortForm: `(${coin.abbr.toUpperCase()})`,
    text: coin.name,
    checkType: 'radio',
  }),
);

export const AddAccountSelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onNext,
    selectedCoin,
    selectedWallet,
    setSelectedCoin,
    handleWalletChange,
    walletDropdownList,
  } = useAddAccountDialog();

  const strings = lang.strings.addAccount.select;
  const button = lang.strings.buttons;

  const handleCoinChange = (id: string | undefined) => {
    if (!id) {
      setSelectedCoin(undefined);
      return;
    }

    setSelectedCoin(coinList[id]);
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={addIcon} alt="Verify Coin" />
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
            onChange={handleWalletChange}
            noLeftImageInList
          />
          <Dropdown
            items={coinDropDownList}
            selectedItem={selectedCoin?.id}
            disabled={!selectedWallet}
            searchText={strings.searchText}
            placeholderText={strings.coinPlaceholder}
            onChange={handleCoinChange}
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
