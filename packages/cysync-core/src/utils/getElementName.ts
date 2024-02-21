import type { ReactNode } from 'react';
import { isValidElement } from 'react';

export const getElementName = (element: ReactNode): string | undefined => {
  if (!isValidElement(element)) {
    return undefined;
  }
  return typeof element.type === 'string' ? element.type : element.type.name;
};
