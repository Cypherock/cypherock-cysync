import React from 'react';
import { Text } from 'react-native';

export interface LangDisplayProps {
  text: string;
  variables?: { [key: string]: React.JSX.Element | string | undefined };
  $noPreWrap?: boolean;
}

export const parseLangTemplate = (
  templateStr: string,
  variables: { [key: string]: React.JSX.Element | string | undefined } = {},
) => {
  const parts = templateStr.split(/\${(.*?)}/g).map((part, index) => {
    if (index % 2 === 1) {
      return variables[part] ?? part;
    }
    return part;
  });

  if (parts.every(part => typeof part === 'string')) {
    return parts.join('');
  }
  return parts;
};

const BaseLangDisplay: React.FC<LangDisplayProps> = ({
  text,
  variables = {},
  $noPreWrap = undefined,
}) => {
  const parsedText = parseLangTemplate(text, variables);

  return (
    <Text style={!$noPreWrap ? { flexWrap: 'wrap' } : undefined}>
      {typeof parsedText === 'string'
        ? parsedText
        : parsedText.map((part: React.ReactNode, index: number) => (
            <React.Fragment key={index}>{part}</React.Fragment>
          ))}
    </Text>
  );
};

export const LangDisplay = React.memo(BaseLangDisplay);
