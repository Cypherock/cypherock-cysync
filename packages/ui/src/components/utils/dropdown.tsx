import { MutableRefObject } from 'react';

import { DropDownItemProps } from '../molecules';

export const findSelectedItem = (
  menuItems: DropDownItemProps[],
  selectedId: string | undefined,
): DropDownItemProps | undefined =>
  menuItems.find(item => item.id === selectedId);

export const searchInItems = (
  menuItems: DropDownItemProps[],
  searchString: string,
): DropDownItemProps[] => {
  const filteredItems: DropDownItemProps[] = [];

  for (const item of menuItems) {
    const shouldAdd = (
      item.text +
      (item.shortForm ?? '') +
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

export const handleKeyDown =
  (
    isOpen: boolean,
    toggleDropdown: () => void,
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    isMultiSelect: boolean,
    focusedIndex: number | null,
    handleCheckedChange: (id: string) => void,
    filteredItems: any,
    listRef: MutableRefObject<HTMLDivElement | null>,
  ) =>
  (event: React.KeyboardEvent<HTMLInputElement>) => {
    const visibleItemsCount = filteredItems.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
        } else {
          setFocusedIndex(prevIndex =>
            prevIndex === null
              ? 0
              : Math.min(prevIndex + 1, visibleItemsCount - 1),
          );
          listRef.current?.focus();

          if (focusedIndex !== null && focusedIndex < visibleItemsCount - 1) {
            const nextItem = listRef.current?.children[
              focusedIndex + 1
            ] as HTMLElement | null;

            const nextItemBottom =
              (nextItem?.offsetTop ?? 0) + (nextItem?.offsetHeight ?? 0);

            const visibleBottom =
              (listRef.current?.scrollTop ?? 0) +
              (listRef.current?.offsetHeight ?? 0);

            if (nextItemBottom > visibleBottom) {
              const scrollOffset =
                nextItemBottom - (listRef.current?.offsetHeight ?? 0);
              listRef.current?.scrollTo({ top: scrollOffset });
            }
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

          if (focusedIndex !== null) {
            if (focusedIndex === 0) {
              listRef.current?.scrollTo({ top: 0 });
            } else {
              const prevItem = listRef.current?.children[focusedIndex - 1] as
                | HTMLElement
                | undefined;
              const scrollOffset = prevItem?.offsetTop;
              listRef.current?.scrollTo({ top: scrollOffset });
            }
          }
        }
        break;
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        if (!isOpen) {
          toggleDropdown();
        } else if (focusedIndex !== null) {
          handleCheckedChange(filteredItems[focusedIndex].id ?? '');
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
  (isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) =>
  (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
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
