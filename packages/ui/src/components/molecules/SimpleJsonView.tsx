import React from 'react';

export interface SimpleJsonViewProps {
  src: object;
}

export const SimpleJsonView: React.FC<SimpleJsonViewProps> = ({ src }) => (
  <div>
    {JSON.stringify(src, null, 4)
      .split('\n')
      .map(line => (
        <div
          style={{
            userSelect: 'text',
            wordBreak: 'break-all',
          }}
          key={line}
        >
          <span style={{ whiteSpace: 'pre' }}>
            {line.replace(line.trimStart(), '')}
          </span>
          {line}
        </div>
      ))}
  </div>
);
