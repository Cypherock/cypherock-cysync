import { DropDownListItemProps } from '../molecules';

export const findSelectedItem = (
  menuItems: DropDownListItemProps[],
  selectedId: string | undefined,
): DropDownListItemProps | undefined => {
  for (const item of menuItems) {
    if (item.id === selectedId) {
      return item;
    }
    if (item.subMenu && item.subMenu.length > 0) {
      const foundItem = findSelectedItem(item.subMenu, selectedId);
      if (foundItem) {
        return foundItem;
      }
    }
  }
  return undefined;
};

export const searchInItems = (
  menuItems: DropDownListItemProps[],
  searchString: string,
  selectedItem: string | undefined,
): DropDownListItemProps[] => {
  const filteredItems: DropDownListItemProps[] = [];
  for (const item of menuItems) {
    const shouldAdd =
      item.id === selectedItem ||
      item.text.toLowerCase().includes(searchString.toLowerCase());

    if (item.subMenu && item.subMenu.length > 0) {
      const subMenuFiltered = searchInItems(
        item.subMenu,
        searchString,
        selectedItem,
      );
      if (subMenuFiltered.length > 0) {
        filteredItems.push({
          ...item,
          subMenu: subMenuFiltered,
        });
      } else if (shouldAdd) {
        filteredItems.push(item);
      }
    } else if (shouldAdd) {
      filteredItems.push(item);
    }
  }
  return filteredItems;
};
