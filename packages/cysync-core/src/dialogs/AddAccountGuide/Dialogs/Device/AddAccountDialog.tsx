import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  Typography,
  Image,
  InputLabel,
  DialogBoxFooter,
  Button,
  settingsIcon,
  bitcoinIcon,
  Flex,
  Toggle,
  FlexGapContainer,
  Container,
  questionMarkIcon,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

export const AddAccountDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const { header, subheader, buttonAddAccount, advanced } =
    lang.strings.addAccount.addAccount.add.info.dialogBox;
  const [isToggledChecked, setToggledChecked] = useState(false);

  const { onNext } = useAddAccountDialog();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const dataArray = [
    {
      id: '32',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 1',
      checkType: 'checkbox',
      tag: 'TAPROOT',
    },
  ];

  const handleCheckChange = (id: string, $isChecked: boolean) => {
    if ($isChecked) {
      setCheckedItems(prevItems => [...prevItems, id]);
    } else {
      setCheckedItems(prevItems => prevItems.filter(item => item !== id));
    }
  };

  const handleToggleChange = (checked: boolean) => {
    setToggledChecked(checked);
  };

  return (
    <DialogBox width={500}>
      <FlexGapContainer pt={4} pr={5} pl={5}>
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={header} />
        </Typography>
      </FlexGapContainer>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={5} width="full">
          <InputLabel
            mt={4}
            mr={2}
            mb={1}
            display="inline-block"
            $fontSize={14}
            $fontWeight="normal"
          >
            <LangDisplay text={subheader} />
          </InputLabel>
          <LeanBoxContainer>
            {dataArray.map(data => (
              <LeanBox
                key={data.id}
                leftImageSrc={data.leftImageSrc}
                text={data.text}
                color="heading"
                textVariant="fineprint"
                tag={data.tag}
                {...(data.checkType ? { checkType: 'checkbox' } : {})}
                id={data.id}
                $isChecked={checkedItems.includes(data.id)}
                onCheckChanged={($isChecked: boolean) => {
                  handleCheckChange(data.id, $isChecked);
                }}
              />
            ))}
          </LeanBoxContainer>
          <Flex direction="row" pr={1} ml="auto">
            <InputLabel
              $fontSize={13}
              $fontWeight="normal"
              ml="auto"
              $textAlign="right"
              px={0}
            >
              <LangDisplay text={advanced} />(
              <Image src={questionMarkIcon} alt="Question Mark" />)
            </InputLabel>
            <Toggle checked={isToggledChecked} onToggle={handleToggleChange} />
          </Flex>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button onClick={() => onNext()} variant="primary">
          <LangDisplay text={buttonAddAccount} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
