import {
  LangDisplay,
  FlexGapContainer,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
  settingsIcon,
  Flex,
  bitcoinIcon,
  Toggle,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

const dataArray = [
  {
    id: '10',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkType: 'checkbox',
    tag: 'TAPROOT',
  },
];
const accountNotSynced = [
  {
    id: '1',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkType: 'checkbox',
    tag: 'TAPROOT',
  },
  {
    id: '2',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkType: 'checkbox',
    tag: 'TAPROOT',
  },
  {
    id: '3',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkType: 'checkbox',
    tag: 'SEGWIT',
  },
  {
    id: '4',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkType: 'checkbox',
    tag: 'NATIVE SEGWIT',
  },
];
const accountsInPortfolio = [
  {
    id: '11',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkType: 'checkbox',
    tag: 'SEGWIT',
  },
  {
    id: '12',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkType: 'checkbox',
    tag: 'NATIVE SEGWIT',
  },
];

export const AddAccountSingleChainDialog: FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { goTo } = useAddAccountDialog();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckBoxChange = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(prevItems => prevItems.filter(item => item !== id));
    } else {
      setCheckedItems(prevItems => [...prevItems, id]);
    }
  };

  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleDeselectAll = () => {
    const uncheckedItems = accountNotSynced.map(data => data.id);
    setCheckedItems(prevItems =>
      prevItems.filter(item => !uncheckedItems.includes(item)),
    );
  };

  const checkedItemsCount = checkedItems.filter(item =>
    accountNotSynced.some(data => data.id === item),
  ).length;

  const handleButtonClick = () => {
    goTo(2, 0);
  };

  const lang = useAppSelector(selectLanguage);
  const singleChain =
    lang.strings.addAccount.addAccount.addAccountSingleChain.info.dialogBox;

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={singleChain.title} />
        </Typography>
      </DialogBoxHeader>
      <FlexGapContainer pt={4} pr={5} pl={5}>
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={singleChain.header} />
        </Typography>
      </FlexGapContainer>
      <DialogBoxBody py={4} px={5}>
        <Flex direction="column">
          <InputLabel
            mt={4}
            mr={1}
            mb={1}
            display="inline-block"
            $fontSize={14}
            $fontWeight="normal"
          >
            <LangDisplay text={singleChain.subheader} />
          </InputLabel>
          <LeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                text={data.text}
                tag={data.tag}
                {...(data.checkType ? { checkType: 'checkbox' } : {})}
                id={data.id}
                onCheckChanged={() => handleCheckBoxChange(data.id)}
                isChecked={checkedItems.includes(data.id)}
                color="white"
              />
            ))}
          </LeanBoxContainer>
          <Flex direction="row" pr={1}>
            <InputLabel $fontSize={13} $fontWeight="normal" textAlign="right">
              <LangDisplay text={singleChain.advanced} />(
              <InputLabel
                pl={0}
                color="gradient"
                display="inline"
                $fontWeight="normal"
              >
                <LangDisplay text={singleChain.questionMark} />
              </InputLabel>
              )
            </InputLabel>
            <Toggle checked={isChecked} onToggle={handleToggleChange} />
          </Flex>
        </Flex>
      </DialogBoxBody>
      <DialogBoxBody pt={2} pb={4} px={5} $bgColor="lightBlack">
        <Flex direction="column" gap={8}>
          <Flex justify="space-between" align="center" px={1}>
            <div>
              <InputLabel $fontSize={14} $fontWeight="normal" px={0} mb={0}>
                <LangDisplay
                  text={`${singleChain.subheader2} (${accountNotSynced.length})`}
                />
              </InputLabel>
            </div>
            <div>
              <InputLabel
                px={0}
                mb={0}
                color="gradient"
                $fontSize={14}
                onClick={handleDeselectAll}
              >
                <LangDisplay
                  text={`${singleChain.deselectAllButton} (${checkedItemsCount})`}
                />
              </InputLabel>
            </div>
          </Flex>
          <LeanBoxContainer>
            {accountNotSynced.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                text={data.text}
                tag={data.tag}
                {...(data.checkType ? { checkType: 'checkbox' } : {})}
                id={data.id}
                onCheckChanged={() => handleCheckBoxChange(data.id)}
                isChecked={checkedItems.includes(data.id)}
                color="white"
              />
            ))}
          </LeanBoxContainer>
        </Flex>
      </DialogBoxBody>

      <DialogBoxBody pt={2} pb={4}>
        <div>
          <InputLabel
            pl={1}
            mr={1}
            mb={1}
            display="inline-block"
            $fontSize={14}
            $fontWeight="normal"
          >
            <LangDisplay
              text={`${singleChain.subheader3} (${accountsInPortfolio.length})`}
            />
          </InputLabel>
          <LeanBoxContainer>
            {accountsInPortfolio.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                text={data.text}
                tag={data.tag}
                {...(data.checkType ? { checkType: 'checkbox' } : {})}
                id={data.id}
                onCheckChanged={() => handleCheckBoxChange(data.id)}
                isChecked={checkedItems.includes(data.id)}
                color="white"
              />
            ))}
          </LeanBoxContainer>
        </div>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="primary" onClick={handleButtonClick}>
          <LangDisplay text={singleChain.buttonAddAccount} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
