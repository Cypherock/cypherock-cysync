import {
  LangDisplay,
  ScrollableContainer,
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
} from '@cypherock/cysync-ui';
import { Toggle } from '@cypherock/cysync-ui/dist/esm/components/atoms/Toggle';
import React, { FC, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountGuide } from '../../context';

const dataArray = [
  {
    id: '10',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkBox: true,
    tag: 'TAPROOT',
  },
];
const accountNotSynced = [
  {
    id: '1',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkBox: true,
    tag: 'TAPROOT',
  },
  {
    id: '2',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkBox: true,
    tag: 'TAPROOT',
  },
  {
    id: '3',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkBox: true,
    tag: 'SEGWIT',
  },
  {
    id: '4',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 2',
    checkBox: true,
    tag: 'NATIVE SEGWIT',
  },
];
const accountsInPortfolio = [
  {
    id: '11',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkBox: true,
    tag: 'SEGWIT',
  },
  {
    id: '12',
    leftImageSrc: bitcoinIcon,
    text: 'Bitcoin 1',
    checkBox: true,
    tag: 'NATIVE SEGWIT',
  },
];

export const AddAccountSingleChainDialog: FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { onNext } = useAddAccountGuide();
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

  const handleClick = () => {
    const uncheckedItems = accountNotSynced.map(data => data.id);
    setCheckedItems(prevItems =>
      prevItems.filter(item => !uncheckedItems.includes(item)),
    );
  };

  const handleButtonClick = () => {
    onNext(2, 0);
  };

  const lang = useAppSelector(selectLanguage);
  const singleChain =
    lang.strings.addAccount.addAccount.addAccountSingleChain.info.dialogBox;

  return (
    <DialogBox width={500} height={700}>
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
      <ScrollableContainer>
        <DialogBoxBody py={4} px={5} overflowY="auto">
          <div>
            <InputLabel
              mt={4}
              mr={1}
              mb={1}
              display={{ def: 'inline-block' }}
              fontSize={14}
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
                  checkBox={data.checkBox}
                  id={data.id}
                  onCheckChange={() => handleCheckBoxChange(data.id)}
                  isChecked={checkedItems.includes(data.id)}
                />
              ))}
            </LeanBoxContainer>
            <InputLabel
              fontSize={13}
              fontWeight="normal"
              textAlign="right"
              pt={1}
              display={{ def: 'inline-block' }}
            >
              <LangDisplay text={singleChain.advanced} />
              <Toggle checked={isChecked} onToggle={handleToggleChange} />
            </InputLabel>
          </div>

          <div>
            <Flex justify="flex-start">
              <InputLabel
                noWrap
                display={{ def: 'inline-block' }}
                fontSize={14}
                fontWeight="normal"
                pl={1}
                mt={2}
                mr={1}
                mb={1}
              >
                <LangDisplay
                  text={`${singleChain.subheader2} (${accountNotSynced.length})`}
                />
              </InputLabel>
              <InputLabel
                color="gold"
                display={{ def: 'inline-block' }}
                fontSize={14}
                pl={1}
                mt={2}
                mr={1}
                mb={1}
                noWrap
                textAlign="right"
                onClick={handleClick}
                clickable
              >
                <LangDisplay text={singleChain.subheaderright} />
              </InputLabel>
            </Flex>
            <LeanBoxContainer>
              {accountNotSynced.map(data => (
                <LeanBox
                  key={data.id}
                  leftImageSrc={data.leftImageSrc}
                  text={data.text}
                  tag={data.tag}
                  checkBox={data.checkBox}
                  id={data.id}
                  onCheckChange={() => handleCheckBoxChange(data.id)}
                  isChecked={checkedItems.includes(data.id)}
                />
              ))}
            </LeanBoxContainer>
          </div>

          <div>
            <InputLabel
              pl={1}
              mr={1}
              mb={1}
              display={{ def: 'inline-block' }}
              fontSize={14}
            >
              <LangDisplay text={singleChain.subheader3} />
            </InputLabel>
            <LeanBoxContainer>
              {accountsInPortfolio.map(data => (
                <LeanBox
                  key={data.id}
                  leftImageSrc={data.leftImageSrc}
                  text={data.text}
                  tag={data.tag}
                  checkBox={data.checkBox}
                  id={data.id}
                  onCheckChange={() => handleCheckBoxChange(data.id)}
                  isChecked={checkedItems.includes(data.id)}
                />
              ))}
            </LeanBoxContainer>
          </div>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button variant="primary" onClick={handleButtonClick}>
          <LangDisplay text={singleChain.submitButton} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
