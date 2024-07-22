import { Marked } from 'marked';
import React from 'react';

export interface LangDisplayProps {
  text: string;
  variables?: object;
  $noPreWrap?: boolean;
  $allowMarkdown?: boolean;
}

const marked = new Marked({
  tokenizer: {
    url: () => undefined,
  },
  gfm: false,
});

export const parseLangTemplate = (templateStr: string, variables = {}) =>
  templateStr.replace(/\${(.*?)}/g, (_, g) => (variables as any)[g] ?? '');

const BaseLangDisplay: React.FC<LangDisplayProps> = ({
  text,
  variables,
  $noPreWrap,
  $allowMarkdown,
}) => {
  let parsedText = parseLangTemplate(text, variables);

  if ($allowMarkdown) {
    parsedText = marked.parseInline(parsedText) as string;
  }

  return (
    <span
      style={!$noPreWrap ? { whiteSpace: 'pre-wrap' } : undefined}
      dangerouslySetInnerHTML={
        $allowMarkdown
          ? {
              __html: parsedText,
            }
          : undefined
      }
    >
      {$allowMarkdown ? undefined : parsedText}
    </span>
  );
};

BaseLangDisplay.defaultProps = {
  variables: undefined,
  $noPreWrap: undefined,
  $allowMarkdown: undefined,
};

export const LangDisplay = React.memo(BaseLangDisplay);
