import {
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
  Container,
  Flex,
} from '@cypherock/cysync-ui';
import { Toggle } from '@cypherock/cysync-ui/dist/esm/components/atoms/Toggle';
import React, { FC, useEffect, useState } from 'react';
import { styled } from 'styled-components';

// ... (other code)
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

const CustomContainer = styled(Container)`
  flex-direction: column;
  gap: 32px;
  z-index: 1;
`;

const ScrollableContainer = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

interface LeanBoxData {
  id: string;
  leftImageSrc: any;
  rightText: string;
  text: string;
  checkBox: boolean;
  tag: string;
  forceUncheck?: boolean;
}

const RenderLeanBox: FC<LeanBoxData> = ({
  id,
  leftImageSrc,
  rightText = undefined,
  text,
  checkBox,
  tag = undefined,
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
  const [forceUncheck, setForceUncheck] = useState(false); // Add this state

  const handleClick = () => {
    setForceUncheck(true); // Uncheck all checkboxes when "subheaderright" is clicked
    setTimeout(() => setForceUncheck(false), 100);
  };

  return (
    <DialogBox width={500} height={700}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          {title}
        </Typography>
      </DialogBoxHeader>
      <CustomContainer padding="32px 40px 0px 40px">
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          {header}
        </Typography>
      </CustomContainer>
      <ScrollableContainer>
        <DialogBoxBody overflowY="auto">
          <div>
            <InputLabel margin="32px 8px 8px 0px">{subheader}</InputLabel>
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
                padding="0px 0px 0px 10px"
                margin="16px 8px 8px 0px"
              >
                {subheader2} ({accountNotSynced.length})
              </InputLabel>
              <InputLabel
                className="gold-label"
                padding="0px 0px 0px 10px"
                margin="16px 8px 8px 0px"
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
            <InputLabel padding="0px 0px 0px 10px" margin="0px 8px 8px 0px">
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
  forceUncheck: false,
};
