import { SignTransactionDeviceEvent } from '@cypherock/coin-support-interfaces';
import { evmCoinList } from '@cypherock/coins';
import {
  ArrowRightIcon,
  Button,
  Check,
  ConfettiBlast,
  Container,
  CopyContainer,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  GoldExternalLink,
  Image,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  Throbber,
  Typography,
  VerifyAmountDeviceGraphics,
  successIcon,
} from '@cypherock/cysync-ui';
import React, { useMemo } from 'react';

import { config } from '~/config';
import { useHysp } from '~/context/hysp';
import { truncateMiddle } from '~/utils';

const checkIcon = <Check width={15} height={12} />;
const throbberIcon = <Throbber size={15} strokeWidth={2} />;
const arrowIcon = <ArrowRightIcon />;

// ─── APY Card styles (same as HyspDeposit) ───────────────────────────────────

const APY_CARD: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  display: 'flex',
  flexDirection: 'row',
};

const APY_CELL: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  padding: '12px 16px',
};

export const HyspStatus: React.FC = () => {
  const {
    step,
    error,
    deviceEvents,
    redeemPath,
    onClose,
    selectedAccount,
    depositTxHash,
    vaultInfo,
    vaultInfoLoading,
    amount,
    selectedToken,
  } = useHysp();

  const isDeviceSigning = [
    'approving',
    'depositing',
    'redeem-approving',
    'redeeming',
  ].includes(step);

  const isPolling = step === 'polling' || step === 'redeem-polling';
  const isDone = step === 'done';
  const isRedeemDone = step === 'redeem-done';
  const isError = step === 'error';

  const getEventIcon = (
    loadingEvent: SignTransactionDeviceEvent,
    completedEvent: SignTransactionDeviceEvent,
  ) => {
    if (deviceEvents[completedEvent]) return checkIcon;
    if (deviceEvents[loadingEvent]) return throbberIcon;
    return undefined;
  };

  const deviceSteps = useMemo<LeanBoxProps[]>(
    () => [
      {
        id: '1',
        text: 'Confirm on X1 Vault',
        leftImage: arrowIcon,
        rightImage: getEventIcon(
          SignTransactionDeviceEvent.INIT,
          SignTransactionDeviceEvent.CONFIRMED,
        ),
      },
      {
        id: '2',
        text: 'Verify transaction details',
        leftImage: arrowIcon,
        rightImage: getEventIcon(
          SignTransactionDeviceEvent.CONFIRMED,
          SignTransactionDeviceEvent.VERIFIED,
        ),
      },
      {
        id: '3',
        text: 'Tap any card',
        leftImage: arrowIcon,
        rightImage: getEventIcon(
          SignTransactionDeviceEvent.VERIFIED,
          SignTransactionDeviceEvent.CARD_TAPPED,
        ),
      },
    ],
    [deviceEvents],
  );

  const getTitle = () => {
    if (step === 'approving' || step === 'redeem-approving')
      return 'Approve on Device';
    if (step === 'depositing') return 'Confirm Deposit on Device';
    if (step === 'redeeming') return 'Confirm Redeem on Device';
    if (isPolling) return 'Waiting for Approval...';
    if (isRedeemDone)
      return redeemPath === 'queue'
        ? 'Redeem Request Submitted'
        : 'Redeem Successful!';
    if (isError) return 'Something Went Wrong';
    return '';
  };

  const getDescription = () => {
    if (step === 'approving' || step === 'redeem-approving')
      return 'Review and confirm the approval on your Cypherock X1.';
    if (step === 'depositing')
      return 'Review and confirm the deposit on your Cypherock X1.';
    if (step === 'redeeming')
      return 'Review and confirm the redemption on your Cypherock X1.';
    if (isPolling)
      return 'Your approval is being confirmed on-chain. This may take a few seconds.';
    if (isRedeemDone && redeemPath === 'queue')
      return 'Your redeem request has been submitted. Funds will be available within 3 business days.';
    if (isRedeemDone) return 'Your mevUSD has been redeemed successfully.';
    if (isError) return error?.message ?? 'An unknown error occurred.';
    return '';
  };

  // Explorer link for the deposit tx
  const explorerLink = (() => {
    if (!depositTxHash || !selectedAccount) return undefined;
    const network =
      evmCoinList[selectedAccount.assetId]?.network ?? selectedAccount.assetId;
    return `${config.API_CYPHEROCK}/eth/transaction/open-txn?network=${network}&txHash=${depositTxHash}&isConfirmed=true`;
  })();

  // ── Confirmation screen ──────────────────────────────────────────────────
  if (isDone) {
    const network = selectedAccount
      ? evmCoinList[selectedAccount.assetId]?.network ?? selectedAccount.assetId
      : '';
    const networkLabel =
      network === 'homestead' || network === 'mainnet'
        ? 'Ethereum Mainnet'
        : network === 'base'
          ? 'Base'
          : network;
    const tokenLabel = selectedToken.toUpperCase();

    const summaryRows: Array<{ label: string; value: React.ReactNode }> = [
      {
        label: 'Staked Amount',
        value: `${amount} ${tokenLabel}`,
      },
      { label: 'Vault', value: 'Midas (HYSP)' },
      { label: 'Network', value: networkLabel },
      ...(depositTxHash
        ? [
            {
              label: 'Transaction Hash',
              value: (
                <Flex align="center" gap={8}>
                  <CopyContainer
                    link={truncateMiddle(depositTxHash)}
                    copyValue={depositTxHash}
                    variant="gold"
                  />
                  {explorerLink && (
                    <a
                      href={explorerLink}
                      target="_blank"
                      style={{ textDecoration: 'none', flexShrink: 0 }}
                      rel="noreferrer"
                    >
                      <GoldExternalLink height={12} width={12} />
                    </a>
                  )}
                </Flex>
              ),
            },
          ]
        : []),
    ];

    return (
      <DialogBox width={500} align="center">
        <ConfettiBlast />
        <DialogBoxBody pt={5} pb={4}>
          <Image src={successIcon} alt="Success" />

          <Container display="flex" direction="column" gap={4} width="full">
            <Typography variant="h4" $textAlign="center">
              Staking Successful!
            </Typography>
            <Typography variant="h6" color="muted" $textAlign="center">
              Your {tokenLabel} has been deposited into the HYSP vault.
            </Typography>
          </Container>

          {/* Transaction summary card */}
          <div
            style={{
              width: '100%',
              borderRadius: 8,
              border: '1px solid #3C3C3C',
              background: '#27221D',
              overflow: 'hidden',
            }}
          >
            {summaryRows.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom:
                    i < summaryRows.length - 1
                      ? '1px solid #3C3C3C'
                      : undefined,
                  gap: 12,
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <Typography variant="span" color="muted" $fontSize={13}>
                    {row.label}
                  </Typography>
                </div>
                {typeof row.value === 'string' ? (
                  <div style={{ textAlign: 'right' }}>
                    <Typography variant="span" $fontSize={13}>
                      {row.value}
                    </Typography>
                  </div>
                ) : (
                  row.value
                )}
              </div>
            ))}
          </div>

          {/* APY Card */}
          <div style={APY_CARD}>
            {vaultInfoLoading || !vaultInfo ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}
              >
                <Throbber size={20} strokeWidth={2} />
              </div>
            ) : (
              <>
                <div style={APY_CELL}>
                  <Typography variant="span" color="muted" $fontSize={12}>
                    Est. APY
                  </Typography>
                  <span
                    style={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: 18,
                      background:
                        'linear-gradient(90deg, #E9BD5E 0%, #F5D98B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {vaultInfo.apy.toFixed(2)}%
                  </span>
                </div>
                <div style={{ width: 1, background: '#3C3C3C', margin: '12px 0' }} />
                <div style={APY_CELL}>
                  <Typography variant="span" color="muted" $fontSize={12}>
                    Withdrawals
                  </Typography>
                  <span
                    style={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#FFFFFF',
                    }}
                  >
                    Flexible
                  </span>
                  <Typography variant="span" color="muted" $fontSize={11}>
                    No lock-up
                  </Typography>
                </div>
              </>
            )}
          </div>
        </DialogBoxBody>

        <DialogBoxFooter height={101}>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    );
  }

  // ── Signing / Polling / Error screens ────────────────────────────────────
  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pb={4} pr={5} pl={5}>
        {isDeviceSigning && (
          <>
            <VerifyAmountDeviceGraphics />
            <LeanBoxContainer>
              {deviceSteps.map(s => (
                <LeanBox
                  key={s.id}
                  id={s.id}
                  text={s.text}
                  leftImage={s.leftImage}
                  rightImage={s.rightImage}
                />
              ))}
            </LeanBoxContainer>
          </>
        )}

        {isPolling && (
          <Flex direction="column" align="center" gap={16}>
            <Throbber size={32} strokeWidth={2} />
          </Flex>
        )}

        <Container display="flex" direction="column" gap={12} width="full">
          <Typography variant="h5" $textAlign="center">
            {getTitle()}
          </Typography>
          <Typography variant="p" color="muted" $textAlign="center">
            {getDescription()}
          </Typography>
        </Container>

        {(isRedeemDone || isError) && (
          <Button onClick={onClose} variant={isError ? 'danger' : 'primary'}>
            {isError ? 'Close' : 'Done'}
          </Button>
        )}
      </DialogBoxBody>
    </DialogBox>
  );
};
