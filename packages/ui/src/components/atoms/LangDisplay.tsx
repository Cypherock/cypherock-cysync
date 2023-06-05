import React from 'react';

interface LangDisplayProps {
  text: string;
}

// TODO: Additional parsing of lang text should be done here
export const LangDisplay: React.FC<LangDisplayProps> = ({ text }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{text}</>
);
