import React from 'react';

interface LangDisplayProps {
  text: string;
  variables?: object;
}

const getText = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (x, g) => (variables as any)[g] ?? '');

const BaseLangDisplay: React.FC<LangDisplayProps> = ({ text, variables }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{getText(text, variables)}</>
);

BaseLangDisplay.defaultProps = {
  variables: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
