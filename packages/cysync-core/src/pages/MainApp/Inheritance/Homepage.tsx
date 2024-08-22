import {
  DashboardWallet,
  Divider,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const Homepage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Flex direction="column" $flex={1} gap={32}>
      <Flex direction="column" gap={24}>
        <Flex direction="column" gap={8}>
          <Typography variant="h6">
            {lang.strings.inheritance.homePage.headers.owner.title}
          </Typography>
          <Typography variant="p" color="muted" $fontSize={14}>
            {lang.strings.inheritance.homePage.headers.owner.subtitle}
          </Typography>
        </Flex>
        <Flex gap={16} $flex={1} width="100%" $flexWrap="wrap">
          <DashboardWallet
            isNone
            type="silver"
            isExpiring={false}
            isExpired={false}
            paymentPending={false}
            name=""
            lang={lang.strings}
            startDate=""
            expiryDate=""
            status="Active"
          />
          {Array(8)
            .fill(0)
            .map(i => (
              <DashboardWallet
                key={i}
                isNone={false}
                type={
                  ['silver', 'gold'][(Math.random() * 100) % 2] as
                    | 'silver'
                    | 'gold'
                }
                isExpiring={false}
                isExpired={false}
                paymentPending={false}
                name="Something"
                lang={lang.strings}
                startDate="09-08-2024"
                expiryDate="09-09-2024"
                status="Active"
              />
            ))}
        </Flex>
      </Flex>
      <Divider variant="horizontal" />
      <Flex direction="column" gap={24}>
        <Flex direction="column" gap={8}>
          <Typography variant="h6">
            {lang.strings.inheritance.homePage.headers.nominee.title}
          </Typography>
          <Typography variant="p" color="muted" $fontSize={14}>
            {lang.strings.inheritance.homePage.headers.nominee.subtitle}
          </Typography>
        </Flex>
        <Flex gap={16} $flex={1} width="100%" $flexWrap="wrap">
          {Array(2)
            .fill(0)
            .map(i => (
              <DashboardWallet
                key={i}
                isNone={false}
                type={
                  ['silver', 'gold'][(Math.random() * 100) % 2] as
                    | 'silver'
                    | 'gold'
                }
                isExpiring={false}
                isExpired
                paymentPending={false}
                name="Something"
                lang={lang.strings}
                startDate="09-01-2024"
                expiryDate="09-07-2024"
                status="Active"
              />
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
