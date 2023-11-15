import { Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

export const Header: FC<{ title: string; subTitle: string }> = ({
  title,
  subTitle,
}) => (
  <Flex align="center" direction="column">
    <Typography
      width={{
        def: 582,
        lg: 1141,
      }}
      $textAlign="center"
      $fontSize={{
        def: 20,
        lg: 24,
      }}
      variant="h4"
      color="heading"
      mb={1}
    >
      <LangDisplay text={title} />
    </Typography>
    <Typography
      display={{
        def: 'none',
        lg: 'block',
      }}
      width={964}
      $textAlign="center"
      variant="h5"
      color="muted"
      mb={1}
    >
      <LangDisplay text={subTitle} />
    </Typography>
  </Flex>
);
