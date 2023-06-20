import { BreakPoint } from '../../themes/screens.styled';
import { theme } from '../../themes/theme.styled';
import { MediaQuery } from '../../types';

export function generateCss<T>(
  properties: string[],
  parsingFunction: (params: T) => string,
  propsValue?: MediaQuery<T>,
) {
  const result: any = [];
  if (propsValue !== undefined) {
    if (typeof propsValue === 'object') {
      for (const breakpoint in propsValue) {
        if (Object.prototype.hasOwnProperty.call(propsValue, breakpoint)) {
          const value = (propsValue as any)[breakpoint as BreakPoint] as T;
          properties.forEach(name => {
            result.push(`
                @media ${theme.screens[breakpoint as BreakPoint]} {
                  ${name}: ${parsingFunction(value)};
                }
              `);
          });
        }
      }
    } else {
      properties.forEach(name => {
        result.push(`${name}: ${parsingFunction(propsValue)};`);
      });
    }
  }
  return result.join(' ');
}
