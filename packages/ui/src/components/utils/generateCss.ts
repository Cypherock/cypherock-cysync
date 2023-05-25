import { BreakPoint } from '../../themes/screens.styled';
import { theme } from '../../themes/theme.styled';
import { MediaQuery } from '../../types/types';

export function generateCss<T>(
  names: string[],
  parsingFunc: (params: T) => string,
  obj?: MediaQuery<T>,
) {
  const result: any = [];
  if (obj) {
    if (typeof obj === 'object') {
      for (const bp in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, bp)) {
          const value = (obj as any)[bp as BreakPoint] as T;
          names.forEach(name => {
            result.push(`
                @media ${theme.screens[bp as BreakPoint]} {
                  ${name}: ${parsingFunc(value)};
                }
              `);
          });
        }
      }
    } else {
      names.forEach(name => {
        result.push(`${name}: ${parsingFunc(obj)};`);
      });
    }
  }
  return result;
}
