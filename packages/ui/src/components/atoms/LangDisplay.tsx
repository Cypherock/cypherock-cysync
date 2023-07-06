import React from 'react';

import { theme } from '../../themes/theme.styled';

interface LangDisplayProps {
  text: string;
  variables?: object;
}

const getMap = (matchedString: string, g: any, variables: any) => {
  const resultStr = matchedString.slice(2, matchedString.length - 1);

  if (matchedString.startsWith('$')) return variables[g] ?? '';

  if (matchedString.startsWith('#'))
    return `<span style="background: ${theme.palette.golden}; -webkit-text-fill-color: transparent; -webkit-background-clip: text;">${resultStr}</span>`;
  return '';
};

const getText = (templateStr: string, variables = {}) => {
  const str = templateStr.replace(/\${(.*?)}|#{(.*?)}/g, (matchedString, g) =>
    getMap(matchedString, g, variables),
  );

  return React.createElement('span', {
    dangerouslySetInnerHTML: { __html: str },
  });
};

const BaseLangDisplay: React.FC<LangDisplayProps> = ({ text, variables }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{getText(text, variables)}</>
);

BaseLangDisplay.defaultProps = {
  variables: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
