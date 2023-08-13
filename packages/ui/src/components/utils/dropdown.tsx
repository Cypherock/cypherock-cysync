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
    listRef: MutableRefObject<HTMLUListElement | null>,
  ) =>
  (event: React.KeyboardEvent<HTMLInputElement>) => {
    const visibleItemsCount = filteredItems.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prevIndex =>
            prevIndex === null
              ? 0
              : Math.min(prevIndex + 1, visibleItemsCount - 1),
          );
          listRef.current?.focus();

          if (focusedIndex === visibleItemsCount - 2) {
            const nextItem = listRef.current?.children[focusedIndex + 1] as
              | HTMLElement
              | undefined;
            const scrollOffset =
              (nextItem.offsetTop ?? 0) -
              (listRef.current?.offsetHeight ?? 0) +
              (nextItem.offsetHeight ?? 0);
            listRef.current?.scrollTo({ top: scrollOffset });
          }
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
          setFocusedIndex(visibleItemsCount - 1);
        } else {
          setFocusedIndex(prevIndex =>
            prevIndex === null
              ? visibleItemsCount - 1
              : Math.max(prevIndex - 1, 0),
          );
          listRef.current?.focus();

          if (focusedIndex === 0) {
            const prevItem = listRef.current?.children[focusedIndex - 1] as
              | HTMLElement
              | undefined;
            const scrollOffset = prevItem?.offsetTop;
            listRef.current?.scrollTo({ top: scrollOffset });
          }
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
  (
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    dropdownRef: React.MutableRefObject<HTMLDivElement | null>,
  ) =>
  (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      dropdownRef.current?.focus();
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
