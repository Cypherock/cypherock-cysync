import React from 'react';
import { Text } from 'react-native';

export interface LangDisplayProps {
  text: string;
  variables?: { [key: string]: React.ReactNode | string };
  $noPreWrap?: boolean;
}

export const parseLangTemplate = (
  templateStr: string,
  variables: { [key: string]: React.ReactNode | string } = {},
) => {
  const parts = templateStr.split(/\${(.*?)}/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return variables[part] ?? part;
    }
    return part;
  });
};

const BaseLangDisplay: React.FC<LangDisplayProps> = ({
  text,
  variables = {},
  $noPreWrap = undefined,
}) => {
  const parsedText = parseLangTemplate(text, variables);

  return (
    <Text style={!$noPreWrap ? { flexWrap: 'wrap' } : undefined}>
      {parsedText.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </Text>
  );
};

export const LangDisplay = React.memo(BaseLangDisplay);
