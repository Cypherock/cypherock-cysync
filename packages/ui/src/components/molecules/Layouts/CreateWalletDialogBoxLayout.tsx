import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { DialogBoxBody, DialogBoxFooter, DialogBoxHeader } from '../DialogBox';
import { ArrowButton, Flex, Image, LangDisplay, Typography } from '../../atoms';

export const CreateWalletDialogBoxLayout: FC<{
  heading: string;
  title: string;
  image: string;
  setState: Dispatch<SetStateAction<number>>;
  children?: ReactNode;
  isLoading?: boolean;
  loadingText: string;
}> = ({
  heading,
  image,
  title,
  children,
  isLoading,
  setState,
  loadingText,
}) => {
  const onPrevious = () => {
    setState(prevProps => {
      if (prevProps - 1 < 0) return prevProps;
      return prevProps - 1;
    });
  };

  const onNext = () => {
    setState(prevProps => {
      if (prevProps + 1 > 5) return prevProps;
      return prevProps + 1;
    });
  };

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
              <LangDisplay text={loadingText} />
            </Typography>
          )}
        </Flex>
        {children}
      </DialogBoxBody>
      <DialogBoxFooter py={{ def: 2, lg: 4 }} gap={10}>
        <ArrowButton direction="left" onClick={onPrevious} />
        <ArrowButton direction="right" onClick={onNext} />
      </DialogBoxFooter>
    </>
  );
};

CreateWalletDialogBoxLayout.defaultProps = {
  children: null,
  isLoading: false,
};
