import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditExecutorMessageDialog } from '../context';

export const FetchData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritanceEditExecutorMessage.fetchData;
  const {
    fetchExecutorMessage,
    retryIndex,
    isFetchExecutorMessageCompleted,
    onNext,
  } = useInheritanceEditExecutorMessageDialog();

  useEffect(() => {
    fetchExecutorMessage();
  }, [retryIndex]);

  useEffect(() => {
    if (isFetchExecutorMessageCompleted) {
      onNext();
    }
  }, [isFetchExecutorMessageCompleted]);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
