import { MutableRefObject } from 'react';

import { DropDownListItemProps } from '../molecules';

export const findSelectedItem = (
  menuItems: DropDownListItemProps[],
  selectedId: string | undefined,
): DropDownListItemProps | undefined => {
  for (const item of menuItems) {
    if (item.id === selectedId) {
      return item;
    }
    // if (item.subMenu && item.subMenu.length > 0) {
    //   const foundItem = findSelectedItem(item.subMenu, selectedId);
    //   if (foundItem) {
    //     return foundItem;
    //   }
    // }
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

    if (shouldAdd) {
      filteredItems.push(item);
    }
  }
  return filteredItems;
};

type MenuItem = DropDownListItemProps & {
  subMenu?: MenuItem[];
};

export const handleKeyDown =
  (
    isOpen: boolean,
    toggleDropdown: () => void,
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    items: MenuItem[],
    focusedIndex: number | null,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    handleCheckedChange: (id: string) => void,
    filteredItems: any,
  ) =>
  (event: React.KeyboardEvent<HTMLInputElement>) => {
    // const flatItems = flattenItems(items);
    const itemsCount = items.length;
    // console.log(flatItems)
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
        } else {
          setFocusedIndex(prevIndex => {
            console.log('prevIndex ', prevIndex, itemsCount - 1);
            return prevIndex === null
              ? 0
              : Math.min(prevIndex + 1, itemsCount - 1);
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
        } else {
          setFocusedIndex(prevIndex =>
            prevIndex === null ? itemsCount - 1 : Math.max(prevIndex - 1, 0),
          );
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
        } else if (focusedIndex !== null) {
          setSelectedIndex(focusedIndex);
          handleCheckedChange(filteredItems[focusedIndex].id ?? '');
          toggleDropdown();
        }
        break;
      case 'Tab':
        if (isOpen) {
          event.preventDefault();
          event.stopPropagation();
          toggleDropdown();
        }
        break;
      default:
        break;
    }
  };

export const handleEscapeKey =
  (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) =>
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

export const handleClickOutside =
  (
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    containerRef: MutableRefObject<HTMLDivElement | null>,
  ) =>
  (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
