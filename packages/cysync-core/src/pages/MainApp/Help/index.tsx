import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';
import { MainAppLayout } from '../Layout';
import {
  // Button,
  Container,
  // QuestionMarkButton,
  // Typography,
} from '@cypherock/cysync-ui';
import HelpContent from './HelpList';
// import { useDispatch } from 'react-redux';
// import { openHelpDialog } from '~/actions';

export const Help: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  // const dispatch = useDispatch();
  return (
    <MainAppLayout topbar={{ title: strings.sidebar.help }}>
      <Container $noFlex m="20">
        <HelpContent />
      </Container>
      {/* For everywhere where question amrk is being used we need to call like this to open HelpDialog */}
      {/* <Button 
        variant="none" 
        color="golden" 
        onClick={() => dispatch(openHelpDialog())}>
        <Typography variant="h5" color="gold">
          ?
        </Typography>
      </Button> */}
    </MainAppLayout>
  );
};
