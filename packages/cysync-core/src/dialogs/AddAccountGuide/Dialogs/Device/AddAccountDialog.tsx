import {
  LangDisplay,
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
  bitcoinIcon,
  Flex,
  Toggle,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useAddAccountDialog } from '../../context';

export const AddAccountDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const { title, header, subheader, buttonAddAccount, advanced, questionMark } =
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

  const handleCheckChange = (id: string, isChecked: boolean) => {
    if (isChecked) {
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
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={settingsIcon} alt="Loader" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={header} />
        </Typography>
        <div>
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
                isChecked={checkedItems.includes(data.id)}
                onCheckChanged={(isChecked: boolean) => {
                  handleCheckChange(data.id, isChecked);
                }}
              />
            ))}
          </LeanBoxContainer>
          <Flex direction="row" pr={1}>
            <InputLabel
              $fontSize={13}
              $fontWeight="normal"
              ml="auto"
              textAlign="right"
              px={0}
            >
              <LangDisplay text={advanced} />(
              <InputLabel
                px={0}
                color="gradient"
                display="inline"
                $fontWeight="normal"
              >
                <LangDisplay text={questionMark} />
              </InputLabel>
              )
            </InputLabel>
            <Toggle checked={isToggledChecked} onToggle={handleToggleChange} />
          </Flex>
        </div>
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button onClick={() => onNext()} variant="primary">
          <LangDisplay text={buttonAddAccount} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
