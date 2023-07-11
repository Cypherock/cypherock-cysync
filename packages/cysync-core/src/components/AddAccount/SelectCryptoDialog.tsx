import {
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  addIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

interface Info {
  dialogBox: {
    title: string;
    header: string;
    subTitle: string;
    constant: string;
    buttonName: string;
    dropDownData: {
      id: string;
      leftImageSrc?: any;
      text: string;
      tag?: string;
      displayRadioButton: boolean;
    }[];
    dropDownDataWithWallet: {
      id: string;
      text: string;
      tag?: string;
      displayRadioButton: boolean;
    }[];
  };
}

export const SelectCryptoDialog: React.FC<{ selectCrypto: Info }> = ({
  selectCrypto,
}) => {
  console.log(selectCrypto);

  return (
    <DialogBox width={500} height={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          {selectCrypto.dialogBox.title}
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody>
        <Image src={addIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            {selectCrypto.dialogBox.header}
          </Typography>
          <Container display="flex" gap={5}>
            <Typography variant="span" color="muted">
              {selectCrypto.dialogBox.subTitle}
            </Typography>
            <Typography variant="span" color="white">
              Cypherock Red
            </Typography>
          </Container>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown items={selectCrypto.dialogBox.dropDownData} />
          <Dropdown
            items={selectCrypto.dialogBox.dropDownDataWithWallet}
            shouldChangeColor
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button variant="primary">{selectCrypto.dialogBox.buttonName}</Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
