import React, { FC, ReactNode } from 'react';

import {
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  DialogBoxFooter,
  DialogBoxProps,
} from './DialogBox';

import { Flex, LangDisplay, Typography } from '../../atoms';

interface IconDialogBoxProps extends DialogBoxProps {
  icon?: ReactNode;
  header?: string;
  title?: string;
  subtext?: string;
  afterTextComponent?: ReactNode;
  footerComponent?: ReactNode;
  textVariables?: object;
}

export const IconDialogBox: FC<IconDialogBoxProps> = ({
  icon,
  header,
  title,
  subtext,
  afterTextComponent,
  footerComponent,
  textVariables,
  ...props
}) => (
  <DialogBox width={500} {...props}>
    {header && (
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={header} />
        </Typography>
      </DialogBoxHeader>
    )}

    <DialogBoxBody
      gap={{
        def: 12,
        lg: 48,
      }}
      p="0"
      py={4}
    >
      <Flex
        gap={{ def: 12, lg: 32 }}
        align="center"
        justify="center"
        width="inherit"
        direction="column"
      >
        {icon}
        <Flex direction="column" align="center" gap={4} px={5}>
          {title && (
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={title} variables={textVariables} />
            </Typography>
          )}
          {subtext && (
            <Typography variant="h6" $textAlign="center" color="muted">
              <LangDisplay text={subtext} variables={textVariables} />
            </Typography>
          )}
        </Flex>
      </Flex>
      {afterTextComponent && (
        <Flex width="full" direction="column" gap={{ def: 24, lg: 48 }} px={5}>
          {afterTextComponent}
        </Flex>
      )}
    </DialogBoxBody>
    {footerComponent && <DialogBoxFooter>{footerComponent}</DialogBoxFooter>}
  </DialogBox>
);

IconDialogBox.defaultProps = {
  icon: undefined,
  header: undefined,
  title: undefined,
  subtext: undefined,
  afterTextComponent: undefined,
  footerComponent: undefined,
  textVariables: undefined,
};
