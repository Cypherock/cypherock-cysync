import {
  Button,
  Container,
  LangDisplay,
  ManyInMany,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

export const SelectWallet = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.inheritanceSilverPlanPurchase;

  const { onNext, onPrevious, allWallets, selectedWallet, setSelectedWallet } =
    useInheritanceSilverPlanPurchaseDialog();

  return (
    <Layout
      footerComponent={
        <>
          <Button onClick={() => onPrevious()} variant="secondary">
            <LangDisplay text={lang.strings.buttons.back} />
          </Button>
          <Button
            onClick={() => onNext()}
            variant="primary"
            disabled={!selectedWallet}
          >
            <LangDisplay text={lang.strings.buttons.next} />
          </Button>
        </>
      }
    >
      <Container direction="column" gap={4}>
        <Typography
          variant="h5"
          color="heading"
          $textAlign="center"
          $fontSize={20}
        >
          <LangDisplay text={strings.selectWallet.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.selectWallet.subTitle} />
        </Typography>
      </Container>
      <ScrollableContainer $maxHeight={264}>
        <Container direction="row" gap={8} $flexWrap="wrap">
          {allWallets.map(wallet => (
            <ManyInMany
              key={wallet.__id ?? ''}
              title={wallet.name}
              disabled={Boolean(wallet.isDeleted) || !wallet.hasPin}
              isSelected={selectedWallet?.__id === wallet.__id}
              onClick={() => setSelectedWallet(wallet)}
              $width={340}
              $height={128}
            />
          ))}
        </Container>
      </ScrollableContainer>
    </Layout>
  );
};
