import React from 'react';

interface LangDisplayProps {
  text: string;
  variables?: object;
}

const parseVariables = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (x, g) => (variables as any)[g] ?? '');

const BaseLangDisplay: React.FC<LangDisplayProps> = ({ text, variables }) => (
  <span style={{ whiteSpace: 'pre-wrap' }}>
    {parseVariables(text, variables)}
  </span>
);

BaseLangDisplay.defaultProps = {
  variables: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
