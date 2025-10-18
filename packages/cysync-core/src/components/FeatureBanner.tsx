import {
  Container,
  Typography,
  Button,
  Image,
  cantonIcon,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

export const FeatureBanner: FC = () => {
  const [isCantonAdded, setIsCantonAdded] = useState(false);
  const [isAutomaticApprovalEnabled, setIsAutomaticApprovalEnabled] =
    useState(false);
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.portfolio.banner;

  useEffect(() => {
    keyValueStore.isCantonAdded.get().then(value => {
      setIsCantonAdded(value);
    });
    keyValueStore.isAutomaticApprovalsEnabled.get().then(value => {
      setIsAutomaticApprovalEnabled(value);
    });
  }, []);

  const enableAutomaticApprovals = useCallback(() => {
    // TODO: Implement the logic to enable automatic approvals for canton
    setIsCantonAdded(true);
  }, []);

  const renderContent = useMemo(
    () => (
      // if (isCantonAdded && isAutomaticApprovalEnabled) return null;

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
    ),
    [isAutomaticApprovalEnabled, isCantonAdded],
  );

  return renderContent;
};
