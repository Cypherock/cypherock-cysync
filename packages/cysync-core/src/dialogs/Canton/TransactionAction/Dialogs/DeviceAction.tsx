import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  LeanBoxContainer,
  LeanBox,
  Throbber,
  LeanBoxProps,
  ArrowRightIcon,
  Check,
  VerifyAmountDeviceGraphics,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

const checkIconComponent = <Check width={15} height={12} />;
const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const DeviceAction: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.dialogs.cantonDialogs;
  const selectedAccountName = 'Canton';

  const verifyAccountCreationText =
    displayText.transactionAction.dialogs.x1Vault.actions.verifyCantonAccount;

  const actionsList: LeanBoxProps[] = [
    {
      id: '1',
      text: `${verifyAccountCreationText.prefix} ${selectedAccountName} ${verifyAccountCreationText.suffix}`,
      leftImage: rightArrowIcon,
      rightImage: checkIconComponent,
    },
    {
      id: '2',
      text: displayText.common.actions.verifyAccountAddress,
      leftImage: rightArrowIcon,
      rightImage: checkIconComponent,
    },
    {
      id: '3',
      text: displayText.common.actions.enterPassphrase,
      leftImage: rightArrowIcon,
      rightImage: throbberComponent,
    },
    {
      id: '4',
      text: displayText.common.actions.enterPinAndTapCard,
      leftImage: rightArrowIcon,
      rightImage: undefined,
    },
  ];

  return (
    <DialogBox width={600}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <VerifyAmountDeviceGraphics />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay
              text={displayText.transactionAction.dialogs.x1Vault.title}
            />
          </Typography>
        </Container>
        <LeanBoxContainer>
          {actionsList.map(data => (
            <LeanBox
              key={data.id}
              leftImage={data.leftImage}
              rightImage={data.rightImage}
              text={data.text}
              image={data.image}
              altText={data.altText}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
