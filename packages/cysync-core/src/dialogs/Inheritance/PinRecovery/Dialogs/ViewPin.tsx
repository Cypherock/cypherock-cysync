import {
  ArrowRightIcon,
  Container,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../context';
import { Layout } from '../Layout';

const throbberComponent = <Throbber size={15} strokeWidth={2} />;
const rightArrowIcon = <ArrowRightIcon />;

export const ViewPin = () => {
  const lang = useAppSelector(selectLanguage);

  const { onNext } = useInheritancePinRecoveryDialog();

  const strings = lang.strings.dialogs.inheritancePinRecovery.viewPin;

  const actionsList = React.useMemo<LeanBoxProps[]>(() => {
    const actions: LeanBoxProps[] = [
      {
        id: '1',
        text: strings.actions.viewDevice,
        leftImage: rightArrowIcon,
        rightImage: throbberComponent,
      },
    ];

    return actions;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout>
      <Container direction="column" width="100%" $flex={1} gap={16}>
        <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
          {strings.title}
        </Typography>
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
      </Container>
    </Layout>
  );
};
