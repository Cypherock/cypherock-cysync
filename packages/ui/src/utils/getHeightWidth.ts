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
      return `${item}px`;
    }
    if (typeof item === 'number') {
      return `${item}px`;
    }
  }
  return ``;
};
