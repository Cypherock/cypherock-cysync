import lodash from 'lodash';
import React, {
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import {
  DropDownListContainer,
  DropdownListItem
} from './DropdownStyles';

import {
  NotFound
} from '../../../assets';
import { Flex, LangDisplay, Typography } from '../../atoms';
import {
  UtilsProps,
  handleKeyBoadNavigation
} from '../../utils';
import { DropDownItem, DropDownItemProps } from '../DropDownItem';

export type MaxVisibleItemCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface DropdownMenuBaseProps {
  items: DropDownItemProps[];
  noLeftImageInList?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  autoFocus?: boolean;
  width?: UtilsProps['width'];
  maxVisibleItemCount?: MaxVisibleItemCount
}

export interface SingleSelectDropdownMenuProps extends DropdownMenuBaseProps {
  onChange?: (selectedItemId: string | undefined) => void;
  isMultiSelect?: false;
  selectedItem?: string | undefined | null;
}

export interface MultiSelectDropdownMenuProps extends DropdownMenuBaseProps {
  onChange?: (selectedItemIds: string[]) => void;
  isMultiSelect: true;
  selectedItems?: (string | undefined | null)[];
}

export interface DropDownMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropdownMenu: React.FC<
  DropDownMenuProps & (SingleSelectDropdownMenuProps | MultiSelectDropdownMenuProps)
> = ({
  items,
  noLeftImageInList,
  disabled = false,
  tabIndex,
  autoFocus,
  isOpen,
  setIsOpen,
  width,
  maxVisibleItemCount = 4,
  ...props
}) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const selectedItemIdsSet = useMemo(
      () =>
        new Set(
          lodash.compact(
            props.isMultiSelect ? props.selectedItems : [props.selectedItem],
          ),
        ),
      [
        props.isMultiSelect,
        props.isMultiSelect ? props.selectedItems : props.selectedItem,
      ],
    );

    const listRef = useRef<HTMLDivElement | null>(null);

    const onChange = useCallback(
      (ids: string[]) => {
        if (props.onChange === undefined) return;
        if (props.isMultiSelect) {
          props.onChange(ids);
        } else {
          props.onChange(ids[0]);
        }
      },
      [props.onChange, props.isMultiSelect],
    );

    const toggleDropdown = useCallback(() => {
      if (disabled) return;
      setIsOpen(!isOpen);
    }, [isOpen, disabled]);

    const handleCheckedChange = useCallback(
      (id: string) => {
        if (!props.isMultiSelect) {
          toggleDropdown();
          onChange([id]);
          return;
        }
        if (selectedItemIdsSet.has(id)) selectedItemIdsSet.delete(id);
        else selectedItemIdsSet.add(id);

        onChange(Array.from(selectedItemIdsSet));
      },
      [props.isMultiSelect, selectedItemIdsSet, onChange, toggleDropdown],
    );

    const rowRenderer = useCallback(
      ({ index, style }: any) => {
        const item = items[index];
        const itemId = item.id ?? '';
        const isItemFocused: boolean = focusedIndex === index;
        const isItemSelected: boolean = selectedItemIdsSet.has(item.id!);
        const checkType = props.isMultiSelect ? 'checkbox' : item.checkType;

        return (
          <DropdownListItem
            style={style}
            key={itemId}
            role="option"
            aria-selected={isItemSelected}
            onMouseEnter={() => setFocusedIndex(index)}
            onFocus={() => setFocusedIndex(index)}
            $isFocused={isItemFocused}
            $cursor={item.disabled ? 'not-allowed' : 'pointer'}
          >
            <DropDownItem
              {...item}
              checked={isItemSelected}
              onCheckedChange={handleCheckedChange}
              id={item.id}
              checkType={checkType}
              leftImage={noLeftImageInList ? undefined : item.leftImage}
              $isFocused={isItemFocused}
              disabled={item.disabled}
            />
          </DropdownListItem>
        );
      },
      [
        items,
        focusedIndex,
        selectedItemIdsSet,
        props.isMultiSelect,
        noLeftImageInList,
        handleCheckedChange,
      ],
    );

    const handleKeyDown = useCallback(() =>
      handleKeyBoadNavigation(
        toggleDropdown,
        setFocusedIndex,
        focusedIndex,
        handleCheckedChange,
        items,
        listRef,
      ), [toggleDropdown, setFocusedIndex, focusedIndex, handleCheckedChange, items, listRef])

    if(isOpen === false) return null;

    if (items.length === 0) {
      return (
        <DropDownListContainer
          $cursor="default"
          onKeyDown={handleKeyDown()}
        >
          <Flex
            justify="center"
            align="center"
            direction="row"
            gap={16}
            px={3}
            py={2}
          >
            <NotFound height={22} width={22} />
            <Typography color="muted">
              <LangDisplay text="No data found" />
            </Typography>
          </Flex>
        </DropDownListContainer>
      )
    }

    return (
      <DropDownListContainer
        ref={listRef}
        height={53 * Math.min(items.length, maxVisibleItemCount) + 32}
        $cursor={disabled ? 'not-allowed' : 'default'}
        tabIndex={disabled ? undefined : tabIndex ?? 0}
        width={width}
        onKeyDown={handleKeyDown()}
      >
        <Virtualize.AutoSizer>
          {({ width, height }: any) => (
            <Virtualize.List
              height={height}
              width={width}
              rowCount={items.length}
              rowHeight={53}
              rowRenderer={rowRenderer}
              scrollToIndex={focusedIndex}
              overscanRowCount={10}
              style={{ outline: 'none' }}
            />
          )}
        </Virtualize.AutoSizer>
      </DropDownListContainer>
    );
  };
