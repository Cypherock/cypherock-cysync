import { IInteractiveItemListItem } from '@/components/ui';

export * from './db';
export * from './dependencies';
export * from './graph';
export * from './logger';

export const findSelectedItem = (
  menuItems: IInteractiveItemListItem[],
  selectedId: string | undefined,
): IInteractiveItemListItem | undefined =>
  menuItems.find(item => item.id === selectedId);

export const searchInItems = (
  menuItems: IInteractiveItemListItem[],
  searchString: string,
): IInteractiveItemListItem[] => {
  const filteredItems: IInteractiveItemListItem[] = [];

  for (const item of menuItems) {
    const shouldAdd = (
      item.text +
      (item.altText ?? '') +
      (item.rightText ?? '') +
      (item.tag ?? '')
    )
      .toLowerCase()
      .includes(searchString.toLowerCase());

    if (shouldAdd) {
      if (item.$parentId) {
        const parentItem = findSelectedItem(menuItems, item.$parentId);
        if (parentItem && !findSelectedItem(filteredItems, parentItem.id)) {
          filteredItems.push(parentItem);
        }
      }
      filteredItems.push(item);
    }
  }
  return filteredItems;
};

export function typedEntries<T extends object>(
  obj: T,
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}
