import React, { FC } from 'react';

import {
  Bullet,
  BulletProps,
  Flex,
  FlexComponentProps,
  LangDisplay,
  Typography,
} from '../atoms';

interface BulletListProps extends FlexComponentProps {
  items: string[];
  variant?: BulletProps['variant'];
}

export const BulletList: FC<BulletListProps> = props => {
  const { items, variant } = props;
  return (
    <Flex
      $bgColor="input"
      direction="column"
      align="flex-start"
      $borderColor="list"
      gap={{ def: 8, lg: 16 }}
      px={3}
      py={2}
      {...props}
    >
      {items.map((item, index) => (
        <Flex
          key={`bullet-wallet-list-${index + 1}`}
          gap={{ def: 8, lg: 16 }}
          align="center"
        >
          <Bullet size="sm" variant={variant} />
          <Typography color="muted">
            <LangDisplay text={item} />
          </Typography>
        </Flex>
      ))}
    </Flex>
  );
};

BulletList.defaultProps = {
  variant: undefined,
};
