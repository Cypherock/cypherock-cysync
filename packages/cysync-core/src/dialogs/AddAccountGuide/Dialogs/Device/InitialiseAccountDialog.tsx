import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  LeanBoxContainer,
  LeanBox,
  verifyCoinIcon,
  Typography,
  Image,
  Container,
  bnbChainIcon,
  checkIcon,
  bitcoinIcon,
  halfLoaderGold,
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

const dataArray = [
  {
    id: '1', // Add a unique identifier to each data object
    leftImageSrc: bnbChainIcon,
    text: 'BNB Chain 1',
    rightImageSrc: checkIcon,
  },
  {
    id: '2',
    leftImageSrc: bitcoinIcon,
    // rightText: '0.77 ETH',
    text: 'Bitcoin 1',
    rightImageSrc: halfLoaderGold,
    animate: true,
  },
  {
    id: '3',
    leftImageSrc: etheriumBlueIcon,
    text: 'Etherium 3',
  },
];
export const InitialiseAccountDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const initAccount = lang.addAccount.initAccount.info.dialogBox;
  const { onNext } = useAddAccountGuide();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const newTimeoutId = setTimeout(() => {
      onNext(1, 1); // Pass the parameter to onNext
    }, 2000);

    setTimeoutId(newTimeoutId);

    return () => {
      // Clear the timeout when the component unmounts or onNext is called
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setSelectedCheckboxes(prevState => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

  return (
    <DialogBox width={500} height={480}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={initAccount.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyCoinIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={initAccount.header} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={initAccount.subheader} />
            <strong style={{ color: 'white' }}>
              {' '}
              <LangDisplay text={initAccount.subheader1} />
            </strong>
          </Typography>
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              text={data.text}
              forceUncheck={false}
              onCheckBoxChange={isChecked =>
                handleCheckboxChange(data.id, isChecked)
              }
              id={data.id}
              selectedItem={selectedCheckboxes[data.id] ? data : null}
              animate={data.animate}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
