import React from 'react';

interface LangDisplayProps {
  text: string;
  variables?: object;
}

const parseVariables = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (x, g) => (variables as any)[g] ?? '');

const parseLineBreaks = (text: string) => (
  <>
    {' '}
    {text.split('\n').map((item, index, arr) => (
      <React.Fragment key={`line breaks ${item}`}>
        {item}
        {arr.length - 1 !== index && <br />}
      </React.Fragment>
    ))}
  </>
);
const BaseLangDisplay: React.FC<LangDisplayProps> = ({ text, variables }) => {
  const parsedText = parseVariables(text, variables);
  const parsedTextWithLineBreaks = parseLineBreaks(parsedText);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{parsedTextWithLineBreaks}</>;
};

BaseLangDisplay.defaultProps = {
  variables: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
