import React from 'react';

export interface LangDisplayProps {
  text: string;
  variables?: object;
  $noPreWrap?: boolean;
}

export const parseLangTemplate = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (x, g) => (variables as any)[g] ?? '');

const BaseLangDisplay: React.FC<LangDisplayProps> = ({
  text,
  variables,
  $noPreWrap,
}) => (
  <span style={!$noPreWrap ? { whiteSpace: 'pre-wrap' } : undefined}>
    {parseLangTemplate(text, variables)}
  </span>
);

BaseLangDisplay.defaultProps = {
  variables: undefined,
  $noPreWrap: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
