import {
  LangDisplay,
  FlexGapContainer,
  DialogBox,
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
import React, { FC, HTMLAttributes, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';
import { styled } from 'styled-components';
import { questionMarkIcon } from '@cypherock/cysync-ui/src';

const dataArray = [
  {
    id: '10',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 3',
    checkType: 'checkbox',
    tag: 'TAPROOT',
  },
  {
    id: '111',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 3',
    checkType: 'checkbox',
    tag: 'SEGWIT',
  },
  {
    id: '121',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkType: 'checkbox',
    tag: 'LEGACY',
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
    rightText: '0.18 BTC',
    tag: 'SEGWIT',
  },
  {
    id: '12',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    rightText: '2.02 BTC',
    tag: 'NATIVE SEGWIT',
  },
];

const ScrollableContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

type ScrollableBoxProps = {
  $backgroundColor?: string;
} & HTMLAttributes<HTMLDivElement>;

const ScrollableBox = styled.div<ScrollableBoxProps>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32px 40px;
  background: ${({ theme, $backgroundColor }) =>
    $backgroundColor ? theme.palette.background[$backgroundColor] : 'none'};
`;

export const AddAccountSingleChainDialog: FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { goTo } = useAddAccountDialog();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const lang = useAppSelector(selectLanguage);
  const singleChain =
    lang.strings.addAccount.addAccount.addAccountSingleChain.info.dialogBox;

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

  const handleSelectAll = () => {
    const allItemIds = accountNotSynced.map(data => data.id);
    setCheckedItems(allItemIds);
  };

  const checkedItemsCount = checkedItems.filter(item =>
    accountNotSynced.some(data => data.id === item),
  ).length;

  const handleButtonClick = () => {
    goTo(2, 0);
  };

  return (
    <DialogBox width={500} height={700}>
      <FlexGapContainer pt={4} pr={5} pl={5}>
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={singleChain.header} />
        </Typography>
      </FlexGapContainer>
      <ScrollableContainer>
        <ScrollableBox>
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
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              text={data.text}
              tag={data.tag}
              checkType={data.checkType as 'checkbox' | 'radio' | undefined}
              id={data.id}
              onCheckChanged={() => handleCheckBoxChange(data.id)}
              $isChecked={checkedItems.includes(data.id)}
              color="white"
            />
          ))}
          <Flex direction="row" pr={1}>
            <InputLabel $fontSize={13} $fontWeight="normal" $textAlign="right">
              <LangDisplay text={singleChain.advanced} />(
              <Image src={questionMarkIcon} alt="Question Mark" />)
            </InputLabel>
            <Toggle checked={isChecked} onToggle={handleToggleChange} />
          </Flex>
        </ScrollableBox>

        <ScrollableBox $backgroundColor="lightBlack">
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
                {checkedItemsCount > 0 ? (
                  <InputLabel
                    px={0}
                    mb={0}
                    color="gradient"
                    $fontSize={14}
                    onClick={handleDeselectAll}
                    $cursor
                  >
                    <LangDisplay
                      text={`${singleChain.deselectAllButton} (${checkedItemsCount})`}
                    />
                  </InputLabel>
                ) : (
                  <InputLabel
                    px={0}
                    mb={0}
                    color="gradient"
                    $fontSize={14}
                    onClick={handleSelectAll}
                    $cursor
                  >
                    <LangDisplay text={singleChain.selectAllButton} />
                  </InputLabel>
                )}
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
                  $isChecked={checkedItems.includes(data.id)}
                  color="white"
                />
              ))}
            </LeanBoxContainer>
          </Flex>
        </ScrollableBox>
        <ScrollableBox>
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
                rightText={data.rightText}
                id={data.id}
                onCheckChanged={() => handleCheckBoxChange(data.id)}
                $isChecked={checkedItems.includes(data.id)}
                color="white"
              />
            ))}
          </LeanBoxContainer>
        </ScrollableBox>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button variant="primary" onClick={handleButtonClick}>
          <LangDisplay text={singleChain.buttonAddAccount} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
