import React, { ReactNode } from 'react';

import { Container, Typography, LangDisplay, Divider } from '../../atoms';

export interface GraphSummaryProps {
  summaryIcon?: ReactNode;
  summaryText?: string;
  summarySubText?: string;
}

export const GraphSummary: React.FC<GraphSummaryProps> = ({
  summaryIcon,
  summaryText,
  summarySubText,
}) => {
  if (!summaryIcon && !summaryText && !summarySubText) {
    return null;
  }

  return (
    <Container
      display="flex"
      align-self="stretch"
      pt={2}
      px={{ def: 3, lg: 5 }}
      width="full"
      gap={8}
      align-items="center"
      justify="flex-start"
    >
      {summaryIcon}
      {(summaryText || summarySubText) && (
        <Container direction="row" display="flex" gap={8}>
          {summaryText && (
            <Typography color="muted" $textAlign="left" $letterSpacing={0.02}>
              <LangDisplay text={summaryText} />
            </Typography>
          )}
          {summarySubText && <Divider variant="vertical" />}
          {summarySubText && (
            <Typography color="muted" $textAlign="left" $letterSpacing={0.02}>
              <LangDisplay text={summarySubText} />
            </Typography>
          )}
        </Container>
      )}
    </Container>
  );
};

GraphSummary.defaultProps = {
  summaryIcon: undefined,
  summaryText: undefined,
  summarySubText: undefined,
};
