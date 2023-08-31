import React from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';

export const JsonView: React.FC<ReactJsonViewProps> = (
  props: ReactJsonViewProps,
) => <ReactJson theme="summerfruit" iconStyle="triangle" {...props} />;
