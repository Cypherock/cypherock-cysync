import {
  DashboardWallet,
  Divider,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { ILangState } from '~/store';

interface HomepageProps {
  lang: ILangState;
}

export const Homepage: FC<HomepageProps> = ({ lang }) => (
  <Flex direction="column" $flex={1} gap={32}>
    <Flex direction="column" gap={24}>
      <Flex direction="column" gap={8}>
        <Typography variant="h6">
          {lang.strings.inheritance.homePage.headers.title.owner}
        </Typography>
        <Typography variant="p" color="muted" $fontSize={14}>
          {lang.strings.inheritance.homePage.headers.subtitle.owner}
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
        {Array(3)
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
          {lang.strings.inheritance.homePage.headers.title.nominee}
        </Typography>
        <Typography variant="p" color="muted" $fontSize={14}>
          {lang.strings.inheritance.homePage.headers.subtitle.nominee}
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
