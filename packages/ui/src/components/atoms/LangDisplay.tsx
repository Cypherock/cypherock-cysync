import React from 'react';

interface LangDisplayProps {
  text: string;
  variables?: object;
  $noPreWrap?: boolean;
}

const parseVariables = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (x, g) => (variables as any)[g] ?? '');

const BaseLangDisplay: React.FC<LangDisplayProps> = ({
  text,
  variables,
  $noPreWrap,
}) => (
  <span style={!$noPreWrap ? { whiteSpace: 'pre-wrap' } : undefined}>
    {parseVariables(text, variables)}
  </span>
);

BaseLangDisplay.defaultProps = {
  variables: undefined,
  $noPreWrap: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
