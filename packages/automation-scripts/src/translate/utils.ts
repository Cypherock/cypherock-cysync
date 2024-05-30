import { JSDOM } from 'jsdom';

export function flattenObject(obj: any, prefix = '') {
  let result: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value)) {
        let index = 0;
        for (const item of value) {
          const arrayKey = `${newKey}[${index}]`;
          if (typeof item === 'object' && item !== null) {
            const nestedResult = flattenObject(item, arrayKey);
            result = { ...result, ...nestedResult };
          } else {
            result[arrayKey] = item;
          }
          index += 1;
        }
      } else if (typeof value === 'object' && value !== null) {
        const nestedResult = flattenObject(value, newKey);
        result = { ...result, ...nestedResult };
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}

export function deflattenObject(flatObj: any) {
  const result: any = {};

  for (const flatKey in flatObj) {
    if (Object.prototype.hasOwnProperty.call(flatObj, flatKey)) {
      const keys = flatKey
        .split('.')
        .reduce<(string | number)[]>((acc, keyPart) => {
          const arrayIndexMatch = keyPart.match(/(.*?)\[(\d+)\]/);
          if (arrayIndexMatch) {
            acc.push(arrayIndexMatch[1], Number(arrayIndexMatch[2]));
          } else {
            acc.push(keyPart);
          }
          return acc;
        }, []);

      let current = result;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = flatObj[flatKey];
        } else {
          if (typeof key === 'number') {
            if (!Array.isArray(current)) {
              current = [];
              current[keys[index - 1]] = [];
            }
            if (!current[key]) {
              current[key] = typeof keys[index + 1] === 'number' ? [] : {};
            }
          } else if (!current[key]) {
            current[key] = typeof keys[index + 1] === 'number' ? [] : {};
          }
          current = current[key];
        }
      });
    }
  }

  return result;
}

export async function convertHTMLToJson(htmlContent: string) {
  const dom = new JSDOM(htmlContent);
  const { document } = dom.window;

  const divs = document.querySelectorAll('div');
  const result: any = {};

  divs.forEach(div => {
    const metaKey = div.getAttribute('meta-key');
    const metaType = div.getAttribute('meta-type') as
      | 'string'
      | 'number'
      | 'boolean';
    if (metaKey) {
      let value: any = div.textContent;

      if (metaType === 'number') {
        value = Number(value);
      } else if (metaType === 'boolean') {
        value = value === 'true';
      }
      result[metaKey] = value;
    }
  });

  return result;
}

export async function convertJsonToHTML(json: any) {
  const flattenedEnJson = flattenObject(json);
  let html = ``;

  for (const [key, value] of Object.entries(flattenedEnJson)) {
    const type = typeof value;
    html += `<div meta-key="${key}" meta-type="${type}">${value}</div>\n`;
  }

  return html;
}
