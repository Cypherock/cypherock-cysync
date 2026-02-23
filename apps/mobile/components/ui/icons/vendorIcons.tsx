import React from 'react';
import config from '@/config';
import { CypherockLockedIcon } from './cypherock-locked';
import { OdixLockedIcon } from './odix-locked';
import { LogotypeIcon as CypherockLogotypeIcon } from './logotype';
import { LogotypeOdixIcon } from './logotype-odix';
import type { SvgProps } from 'react-native-svg';

const isOdix = config.VENDOR === 'odix';

export const LockedIcon = (props: SvgProps) =>
  isOdix ? <OdixLockedIcon {...props} /> : <CypherockLockedIcon {...props} />;

export const LogotypeIcon = (props: SvgProps) =>
  isOdix ? (
    <LogotypeOdixIcon {...props} />
  ) : (
    <CypherockLogotypeIcon {...props} />
  );
