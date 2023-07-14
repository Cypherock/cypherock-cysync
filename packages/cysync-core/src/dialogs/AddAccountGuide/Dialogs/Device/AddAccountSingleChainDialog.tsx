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
import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

interface LeanBoxData {
  id: string;
  leftImageSrc: any;
  rightText?: string;
  text: string;
  checkBox: boolean;
  tag?: string;
  forceUncheck?: boolean;
}

const RenderLeanBox: FC<LeanBoxData> = ({
  id,
  leftImageSrc,
  rightText = '',
  text,
  checkBox,
  tag = '',
  forceUncheck = false,
}) => {
  const [forceUncheckState, setForceUncheck] = useState(forceUncheck);

  useEffect(() => {
    setForceUncheck(forceUncheck);
  }, [forceUncheckState]);

  return (
    <LeanBox
      key={id}
      leftImageSrc={leftImageSrc}
      rightText={rightText}
      text={text}
      color="heading"
      textVariant="fineprint"
      tag={tag}
      checkBox={checkBox}
      id={id}
      forceUncheck={forceUncheck}
    />
  );
};

export const AddAccountSingleChainDialog: FC = () => {
  const [forceUncheck, setForceUncheck] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { onNext } = useAddAccountGuide();

  const dataArray = [
    {
      id: '2',
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
      id: '22',
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
      id: '31',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 1',
      checkBox: true,
      tag: 'SEGWIT',
    },
    {
      id: '32',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 1',
      checkBox: true,
      tag: 'NATIVE SEGWIT',
    },
  ];

  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleClick = () => {
    setForceUncheck(true);
    setTimeout(() => setForceUncheck(false), 100);
  };

  const handleButtonClick = () => {
    onNext(2, 1);
  };

  const lang = useAppSelector(state => state.addAccount.strings);
  const singleChain = lang.addAccount.addAccountSingleChain.info.dialogBox;

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
        <DialogBoxBody pt={4} pr={5} pb={4} pl={5} overflowY="auto">
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
                <RenderLeanBox key={data.id} {...data} />
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
                  text={singleChain.subheader2}
                  variables={{
                    length: singleChain.accountNotSynced.length.toString(),
                  }}
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
                <LangDisplay
                  text={singleChain.subheaderright}
                  variables={{
                    length: singleChain.accountNotSynced.length.toString(),
                  }}
                />
              </InputLabel>
            </Flex>
            <LeanBoxContainer>
              {accountNotSynced.map(data => (
                <RenderLeanBox
                  key={data.id}
                  {...data}
                  forceUncheck={forceUncheck}
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
                <RenderLeanBox key={data.id} {...data} />
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

RenderLeanBox.defaultProps = {
  rightText: '',
  tag: '',
  forceUncheck: false,
};
