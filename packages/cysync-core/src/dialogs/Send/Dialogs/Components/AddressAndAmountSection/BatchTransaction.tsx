import { IPreparedTransactionOutput } from '@cypherock/coin-support-interfaces';
import {
  convertToUnit,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import {
  Divider,
  Flex,
  Container,
  Typography,
  BatchContainer,
  Button,
  PlusGoldenIcon,
} from '@cypherock/cysync-ui';
import { uniqueId } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { useSendDialog } from '~/dialogs/Send/context';
import { useStateWithRef } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { AddressInput } from './AddressInput';
import { AmountInput } from './AmountInput';
import { NotesInput } from './NotesInput';

export const BatchTransaction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;

  const {
    selectedAccount,
    transaction,
    transactionRef,
    priceConverter,
    prepare,
    getOutputError,
    getAmountError,
  } = useSendDialog();
  const [outputs, setOutputs, outputsRef] = useStateWithRef<
    (IPreparedTransactionOutput & { id: string })[]
  >([
    {
      address: transaction?.userInputs.outputs[0]?.address ?? '',
      amount: transaction?.userInputs.outputs[0]?.amount ?? '',
      remarks: transaction?.userInputs.outputs[0]?.remarks ?? '',

      id: uniqueId(),
    },
    { address: '', amount: '', remarks: '', id: uniqueId() },
  ]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [enableAutoScroll, setEnableAutoScroll] = useState(false);

  useEffect(() => {
    parseAndPrepare(outputs);
  }, []);

  const parseAndPrepare = async (newOutputs: typeof outputs) => {
    const txn = transactionRef.current;

    if (!txn) return;
    txn.userInputs.outputs = newOutputs.map(({ address, amount, remarks }) => ({
      address,
      amount,
      remarks,
    }));
    txn.userInputs.isSendAll = false;
    await prepare(txn);
  };

  const handleButtonClick = () => {
    if (!transaction) return;
    const newOutputs = [
      ...outputs,
      { address: '', amount: '', id: uniqueId() },
    ];
    setOutputs(newOutputs);
    setEnableAutoScroll(true);
  };

  const handleDeleteClick = (id: string) => {
    if (outputs.length <= 2) return;
    const newOutputs = outputs.filter(output => output.id !== id);
    setOutputs(newOutputs);
    parseAndPrepare(newOutputs);
  };

  const handleAddressChange = async (val: string, id: string) => {
    const outputIndex = outputsRef.current.findIndex(
      output => output.id === id,
    );
    const newOutputs = [...outputsRef.current];
    newOutputs[outputIndex].address = val;
    setOutputs(newOutputs);
    await parseAndPrepare(newOutputs);
  };

  const handleAmountChange = async (val: string, id: string) => {
    if (!selectedAccount) return;
    const convertedAmount = convertToUnit({
      amount: val,
      coinId: selectedAccount.parentAssetId,
      fromUnitAbbr:
        selectedAccount.unit ??
        getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
          .abbr,
      toUnitAbbr: getZeroUnit(selectedAccount.parentAssetId).abbr,
    });
    const outputIndex = outputsRef.current.findIndex(
      output => output.id === id,
    );
    const newOutputs = [...outputsRef.current];
    newOutputs[outputIndex].amount = convertedAmount.amount;
    setOutputs(newOutputs);
    await parseAndPrepare(newOutputs);
  };

  const getConvertedAmount = (val?: string) => {
    if (!val || !selectedAccount) return undefined;
    return getParsedAmount({
      coinId: selectedAccount.parentAssetId,
      amount: val,
      unitAbbr:
        selectedAccount.unit ??
        getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
          .abbr,
    }).amount;
  };

  const handleTransactionRemarks = async (remark: string, id: string) => {
    const txn = transactionRef.current;
    if (!txn) return;

    const trimmedRemark = remark.trim();

    const outputIndex = outputsRef.current.findIndex(
      output => output.id === id,
    );

    const newOutputs = [...outputsRef.current];
    newOutputs[outputIndex].remarks = trimmedRemark;
    setOutputs(newOutputs);
    await parseAndPrepare(newOutputs);
  };
  useEffect(() => {
    if (containerRef.current && enableAutoScroll) {
      const lastChild = containerRef.current.lastElementChild;
      lastChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [outputs, enableAutoScroll]);

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <BatchContainer ref={containerRef}>
        <Container
          display="flex"
          justify="space-between"
          align="center"
          direction="column"
        >
          <Flex gap={16} direction="column" width="full">
            {outputs.map((output, i) => (
              <Flex key={`inputs-${output.id}`} gap={8} direction="column">
                <AddressInput
                  label={displayText.recipient.label}
                  placeholder={displayText.recipient.placeholder}
                  initialValue={output.address}
                  error={getOutputError(i)}
                  onChange={async val => {
                    await handleAddressChange(val, output.id);
                  }}
                  onDelete={() => handleDeleteClick(output.id)}
                  showDeleteButton
                  isButtonDisabled={outputs.length <= 2}
                  index={i}
                />
                <AmountInput
                  label={displayText.amount.label}
                  coinUnit={
                    selectedAccount
                      ? selectedAccount.unit ??
                        getDefaultUnit(
                          selectedAccount.parentAssetId,
                          selectedAccount.assetId,
                        ).abbr
                      : ''
                  }
                  priceUnit={displayText.amount.dollar}
                  error={getAmountError()}
                  placeholder={displayText.amount.placeholder}
                  initialAmount={getConvertedAmount(output.amount)}
                  onChange={async val => {
                    await handleAmountChange(val, output.id);
                  }}
                  converter={priceConverter}
                />
                <NotesInput
                  label={displayText.remarks.label}
                  placeholder={displayText.remarks.placeholder}
                  initialValue=""
                  onChange={async remark => {
                    await handleTransactionRemarks(remark, output.id);
                  }}
                />
                {i !== outputs.length - 1 && <Divider variant="horizontal" />}
              </Flex>
            ))}
          </Flex>
          <Button
            onClick={handleButtonClick}
            $bgColor="separatorSecondary"
            width="full"
            display="flex"
            align="center"
            justify="center"
            p={1}
            $borderRadius={8}
            gap={16}
            mt={2}
          >
            <Typography $fontSize={13} $fontWeight="normal" color="muted">
              {displayText.addButton}
            </Typography>
            <PlusGoldenIcon />
          </Button>
        </Container>
      </BatchContainer>
    </Container>
  );
};
