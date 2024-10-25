import { Divider } from '@cypherock/cysync-ui';
import React from 'react';

import { FeesTitle } from './FeesTitle';

export interface FeesHeaderProps {
  initialState: boolean;
  onChange: (isToggled: boolean) => void;
  title: string;
  isToggleButtonHidden?: boolean;
}
export const FeesHeader: React.FC<FeesHeaderProps> = ({
  initialState,
  onChange,
  title,
  isToggleButtonHidden,
}) => (
  <>
    <Divider variant="horizontal" />

    <FeesTitle
      initialState={initialState}
      onChange={onChange}
      title={title}
      isToggleButtonHidden={isToggleButtonHidden}
    />
  </>
);

FeesHeader.defaultProps = {
  isToggleButtonHidden: false,
};
