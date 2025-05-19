import React from 'react';

import { ErrorDialog } from './Dialog';

import { Flex } from '../atoms';

const SUPPORT_EMAIL = 'support@cypherock.com';

export const FallbackRenderer: React.FC = ({
  error,
  resetErrorBoundary,
}: any) => (
  <Flex
    height="screen"
    width="screen"
    justify="center"
    align="center"
    $bgColor="contentGradient"
  >
    <ErrorDialog
      title="cySync app encountered an issue"
      subtext={`Please restart the app and try again. If the problem persists, contact support at **${SUPPORT_EMAIL}** for assistance`}
      iconType="default"
      primaryActionText="Restart"
      onPrimaryClick={() => resetErrorBoundary(error)}
      secondaryActionText="Email Support"
      onSecondaryClick={() =>
        window.open(`mailto:${SUPPORT_EMAIL}`, '_blank', 'noopener,noreferrer')
      }
      allowMarkdown
    />
  </Flex>
);
