import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Container,
  LangDisplay,
  ManyInMany,
  ScrollableContainer,
  Tooltip,
  TooltipPlacement,
  Typography,
} from '@cypherock/cysync-ui';

import { selectLanguage, useAppSelector } from '~/store';
import { useInheritanceSilverPlanPurchaseDialog } from '../context';
import { Layout } from '../Layout';

export const SelectWallet = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceSilverPlanPurchase;

  const { onNext, onPrevious, allWallets, selectedWallet, setSelectedWallet } =
    useInheritanceSilverPlanPurchaseDialog();

  const [tooltipPlacement, setTooltipPlacement] =
    useState<TooltipPlacement>('bottom');

  const observerRef = useRef<IntersectionObserver>();

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        setTooltipPlacement('bottom');
      } else if (
        entry.rootBounds &&
        entry.boundingClientRect.bottom > entry.rootBounds.bottom
      ) {
        setTooltipPlacement('top');
      }
    });
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: document.querySelector('.scrollable-container'),
      threshold: 0.95,
    });
    const observedElements = document.querySelectorAll('.wallet-card');

    observedElements.forEach(el => {
      observerRef?.current?.observe(el);
    });

    return () => {
      observedElements.forEach(el => {
        observerRef?.current?.unobserve(el);
      });
    };
  }, [allWallets]);

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
          <LangDisplay text={strings.wallet.selectWallet.title} />
        </Typography>
        <Typography color="muted" $textAlign="center" $fontSize={16}>
          <LangDisplay text={strings.wallet.selectWallet.subTitle} />
        </Typography>
      </Container>
      <ScrollableContainer $maxHeight={264} className="scrollable-container">
        <Container direction="row" gap={8} $flexWrap="wrap">
          {allWallets.map(wallet => {
            const isDisabled = Boolean(wallet.isDeleted) || !wallet.hasPin;
            if (isDisabled) {
              return (
                <Tooltip
                  key={wallet.__id ?? ''}
                  text={strings.wallet.selectWallet.tooltip}
                  tooltipPlacement={tooltipPlacement}
                >
                  <div className="wallet-card">
                    <ManyInMany
                      title={wallet.name}
                      disabled={isDisabled}
                      isSelected={selectedWallet?.__id === wallet.__id}
                      onClick={() => setSelectedWallet(wallet)}
                      $width={340}
                      $height={128}
                    />
                  </div>
                </Tooltip>
              );
            }
            return (
              <ManyInMany
                key={wallet.__id ?? ''}
                title={wallet.name}
                disabled={isDisabled}
                isSelected={selectedWallet?.__id === wallet.__id}
                onClick={() => setSelectedWallet(wallet)}
                $width={340}
                $height={128}
              />
            );
          })}
        </Container>
      </ScrollableContainer>
    </Layout>
  );
};
