import React, { FC } from 'react';

import { Bullet, Flex, LangDisplay, Typography } from '../atoms';

export const BulletList: FC<{ items: any[] }> = ({ items }) => (
  <Flex
    $bgColor="input"
    direction="column"
    align="flex-start"
    $borderColor="list"
    gap={{ def: 8, lg: 16 }}
    px={3}
    py={2}
  >
    {items.map((item, index) => (
      <Flex
        key={`bullet-wallet-list-${index + 1}`}
        gap={{ def: 8, lg: 16 }}
        align="center"
      >
        <Bullet size="sm" />
        <Typography color="muted">
          <LangDisplay text={item} />
        </Typography>
      </Flex>
    ))}
  </Flex>
);
