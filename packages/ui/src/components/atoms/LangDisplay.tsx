import React from 'react';

interface LangDisplayProps {
  text: string;
  variables?: object;
}

export const parseLangTemplate = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (x, g) => (variables as any)[g] ?? '');

const BaseLangDisplay: React.FC<LangDisplayProps> = ({ text, variables }) => (
  <span style={{ whiteSpace: 'pre-wrap' }}>
    {parseLangTemplate(text, variables)}
  </span>
);

BaseLangDisplay.defaultProps = {
  variables: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
