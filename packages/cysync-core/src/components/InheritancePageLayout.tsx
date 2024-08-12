import {
  ArrowBackGoldenIcon,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Container,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';

interface InheritancePageLayoutProps {
  children?: ReactNode;
  headingOnly?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  onClick?: () => void;
  lang: {
    choosePlan: {
      title: string;
    };
  };
  actionButtonText?: string;
}

export const InheritancePageLayout: FC<InheritancePageLayoutProps> = ({
  children,
  breadcrumbs,
  headingOnly,
  lang,
  onClick,
  actionButtonText,
}) => (
  <Container
    $flex={1}
    m="20"
    $borderRadius={24}
    direction="column"
    justify="space-between"
    shadow="popup"
  >
    <Container width="100%" justify="space-between" py={4} px={5}>
      {breadcrumbs ? (
        <Breadcrumb items={breadcrumbs} />
      ) : (
        <Button
          variant="icon"
          icon={<ArrowBackGoldenIcon />}
          onClick={onClick}
        />
      )}
      {headingOnly ? (
        <Flex width="100%" justify="center">
          <Typography variant="h2" $fontWeight="medium">
            {lang.choosePlan.title}
          </Typography>
        </Flex>
      ) : (
        <Button onClick={onClick}>{actionButtonText}</Button>
      )}
    </Container>
    <Container $flex={1} px={5} pb={4}>
      {children}
    </Container>
  </Container>
);

InheritancePageLayout.defaultProps = {
  children: undefined,
  headingOnly: undefined,
  breadcrumbs: undefined,
  onClick: undefined,
  actionButtonText: undefined,
};
