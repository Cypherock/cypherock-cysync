import {
  ScrollableContainer,
  CustomContainer,
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
} from '@cypherock/cysync-ui';
import { Toggle } from '@cypherock/cysync-ui/dist/esm/components/atoms/Toggle';
import React, { FC, useEffect, useState } from 'react';

interface AddAccountSingleChainDialogProps {
  addAccount: {
    info: {
      dialogBox: {
        title: string;
        header: string;
        subheader: string;
        subheader2: string;
        subheader3: string;
        submitButton: string;
        subheaderright: string;
        advanced: string;
        dataArray: {
          id: string;
          leftImageSrc: any;
          rightText?: string;
          text: string;
          checkBox: boolean;
          tag?: string;
        }[];
        accountNotSynced: {
          id: string;
          leftImageSrc: any;
          rightText?: string;
          text: string;
          checkBox: boolean;
          tag?: string;
        }[];
        accountsInPortfolio: {
          id: string;
          leftImageSrc: any;
          rightText?: string;
          text: string;
          checkBox: boolean;
          tag?: string;
        }[];
      };
    };
  };
}

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

export const AddAccountSingleChainDialog: FC<
  AddAccountSingleChainDialogProps
> = ({
  addAccount: {
    info: {
      dialogBox: {
        title,
        header,
        subheader,
        subheader2,
        subheader3,
        subheaderright,
        submitButton,
        advanced,
        dataArray,
        accountNotSynced,
        accountsInPortfolio,
      },
    },
  },
}) => {
  const [forceUncheck, setForceUncheck] = useState(false);

  const handleClick = () => {
    setForceUncheck(true);
    setTimeout(() => setForceUncheck(false), 100);
  };

  return (
    <DialogBox width={500} height={700}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          {title}
        </Typography>
      </DialogBoxHeader>
      <CustomContainer pt={4} pr={5} pl={5}>
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          {header}
        </Typography>
      </CustomContainer>
      <ScrollableContainer>
        <DialogBoxBody overflowY="auto">
          <div>
            <InputLabel mt={4} mr={1} mb={1}>
              {subheader}
            </InputLabel>
            <LeanBoxContainer padding="0px">
              {dataArray.map(data => (
                <RenderLeanBox key={data.id} {...data} />
              ))}
            </LeanBoxContainer>
            <InputLabel fontSize="13px" fontWeight="400" textAlign="right">
              {advanced} <Toggle />
            </InputLabel>
          </div>

          <div>
            <Flex justify="flex-start" fullWidth>
              <InputLabel
                noWrap
                fontSize="13px"
                fontWeight="400"
                pl={1}
                mt={2}
                mr={1}
                mb={1}
              >
                {subheader2} ({accountNotSynced.length})
              </InputLabel>
              <InputLabel
                className="gold-label"
                pl={1}
                mt={2}
                mr={1}
                mb={1}
                noWrap
                textAlign="right"
                onClick={handleClick}
                clickable
              >
                {subheaderright} ({accountNotSynced.length})
              </InputLabel>
            </Flex>
            <LeanBoxContainer padding="0px">
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
            <InputLabel pl={1} mr={1} mb={1}>
              {subheader3}
            </InputLabel>
            <LeanBoxContainer padding="0px">
              {accountsInPortfolio.map(data => (
                <RenderLeanBox key={data.id} {...data} />
              ))}
            </LeanBoxContainer>
          </div>
        </DialogBoxBody>
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button variant="primary">{submitButton}</Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};

RenderLeanBox.defaultProps = {
  rightText: '',
  tag: '',
  forceUncheck: false,
};
