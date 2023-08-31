import { getFractionPercentage } from './getFractionPercentage';

export const getHeightWidth = (
  item: number | string,
  itemMap: Record<string, string>,
) => {
  if (item !== undefined) {
    if (typeof item === 'string') {
      if (itemMap[item]) {
        return itemMap[item];
      }
      if (item.includes('/')) {
        return getFractionPercentage(item);
      }
      // If the value has any alphabet at the end, we assume
      // the unit is already present.
      const lastChar = item[item.length - 1];
      if (!lastChar.match(/[0-9]/)) {
        return item;
      }
      return `${item}px`;
    }
    if (typeof item === 'number') {
      return `${item}px`;
    }
  }
  return ``;
};
