import React, { useEffect } from 'react';

import { getUserCountry } from '~/services/countryService';
import logger from '~/utils/logger';

import { setCountryCode, useAppDispatch } from '../..';

export const CountryTask: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    getUserCountry()
      .then(code => {
        dispatch(setCountryCode(code));
        logger.info('Country detected', { countryCode: code });
      })
      .catch(e => {
        logger.warn('Country detection failed', e as object);
        dispatch(setCountryCode(undefined));
      });
  }, []);

  return null;
};
