import {
  ArrowButton,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const DialogBoxLayout: FC<{
  heading: string;
  title: string;
  image: string;
  setState: Dispatch<SetStateAction<number>>;
  children?: ReactNode;
  isLoading?: boolean;
}> = ({ heading, image, title, children, isLoading, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <>
      <DialogBoxHeader p={2}>
        <Typography variant="h6" color="muted">
          <LangDisplay text={heading} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody
        gap={{
          def: 12,
          lg: 32,
        }}
        p="0"
      >
        <Image src={image} alt="device" />
        <Flex gap={5} direction="column" align="center">
          <Typography px={8} $textAlign="center" variant="h5">
            <LangDisplay text={title} />
          </Typography>
          {isLoading && (
            <Typography color="muted">
              <LangDisplay
                text={lang.strings.onboarding.createWallet.confirmPin.loading}
              />
            </Typography>
          )}
        </Flex>
        {children}
      </DialogBoxBody>
      <DialogBoxFooter py={{ def: 2, lg: 4 }} gap={10}>
        <ArrowButton
          direction="left"
          onClick={() =>
            setState(prevProps => {
              if (prevProps - 1 < 0) return prevProps;
              return prevProps - 1;
            })
          }
        />
        <ArrowButton
          direction="right"
          onClick={() =>
            setState(prevProps => {
              if (prevProps + 1 > 5) return prevProps;
              return prevProps + 1;
            })
          }
        />
      </DialogBoxFooter>
    </>
  );
};
DialogBoxLayout.defaultProps = {
  children: null,
  isLoading: false,
};
