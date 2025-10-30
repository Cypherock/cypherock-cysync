import {
  Container,
  Typography,
  Button,
  Image,
  cantonIcon,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { openEnableApprovalPromptDialog } from '~/actions';
import { routes } from '~/constants';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

export const FeatureBanner: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.portfolio.banner;

  const { path } = routes.portfolio;
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isPortfolioPage = location.pathname.startsWith(path);

  // TODO: Implement the logic to check if canton is added and automatic approvals are enabled
  const [isCantonAdded, setIsCantonAdded] = useState(false);
  const [isAutomaticApprovalEnabled, setIsAutomaticApprovalEnabled] =
    useState(true);

  const enableAutomaticApprovals = useCallback(() => {
    dispatch(openEnableApprovalPromptDialog());
    setIsAutomaticApprovalEnabled(true);
    setIsCantonAdded(true);
  }, [dispatch]);

  const renderContent = useMemo(() => {
    if (!isPortfolioPage) return null;

    return (
      <Container $bgColor="contentGradient" width="full">
        <Container
          direction="row"
          $bgColor="featureBanner"
          width="full"
          justify="flex-start"
          p={2}
          $borderRadius={16}
          gap={16}
        >
          <Image src={cantonIcon} alt="canton logo" $width={30} $height={30} />
          <Typography $fontSize={16} width="100%">
            <LangDisplay
              text={
                isCantonAdded && !isAutomaticApprovalEnabled
                  ? strings.enableAutomaticApprovals.title
                  : strings.addCanton.title
              }
              $allowMarkdown
            />
          </Typography>
          {isCantonAdded && !isAutomaticApprovalEnabled ? (
            <Button variant="primary" onClick={enableAutomaticApprovals}>
              {strings.enableAutomaticApprovals.button}
            </Button>
          ) : (
            <Button variant="primary">
              <a
                href="https://cypherock.com"
                target="_blank"
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  whiteSpace: 'nowrap',
                }}
                rel="noreferrer"
              >
                {strings.addCanton.button}
              </a>
            </Button>
          )}
        </Container>
      </Container>
    );
  }, [isAutomaticApprovalEnabled, isCantonAdded]);

  return renderContent;
};
