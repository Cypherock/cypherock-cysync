import { Divider } from '@cypherock/cysync-ui';
import React from 'react';

import { FeesTitle } from './FeesTitle';

export interface FeesHeaderProps {
  initialState: boolean;
  onChange: (isToggled: boolean) => void;
  title: string;
  toggleNotAllowed?: boolean;
}
export const FeesHeader: React.FC<FeesHeaderProps> = ({
  initialState,
  onChange,
  title,
  toggleNotAllowed,
}) => (
  <>
    <Divider variant="horizontal" />

    <FeesTitle
      initialState={initialState}
      onChange={onChange}
      title={title}
      toggleNotAllowed={toggleNotAllowed}
    />
  </>
);

FeesHeader.defaultProps = {
  toggleNotAllowed: false,
};
