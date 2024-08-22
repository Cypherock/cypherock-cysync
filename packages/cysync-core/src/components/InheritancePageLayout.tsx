import { Button, Container, Flex, LangDisplay } from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';

interface InheritancePageLayoutProps {
  children?: ReactNode;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
}

export const InheritancePageLayout: FC<InheritancePageLayoutProps> = ({
  children,
  onActionButtonClick,
  actionButtonText,
}) => (
  <Container
    $flex={1}
    m="20"
    $borderRadius={24}
    direction="column"
    shadow="popup"
  >
    {onActionButtonClick && actionButtonText && (
      <Container width="100%" justify="flex-end" py={4} px={5}>
        <Button onClick={onActionButtonClick}>
          <LangDisplay text={actionButtonText} />
        </Button>
      </Container>
    )}
    <Flex $flex={1} px={5} pb={4} width="100%">
      {children}
    </Flex>
  </Container>
);

InheritancePageLayout.defaultProps = {
  children: undefined,
  onActionButtonClick: undefined,
  actionButtonText: undefined,
};