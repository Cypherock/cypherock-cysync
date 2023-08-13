import {
  Container,
  Flex,
  MiniContainer,
  CalendarIcon,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '~/store';
import DatePicker from 'react-multi-date-picker';
import { styled } from 'styled-components';
import { goldenGradient } from '@cypherock/cysync-ui/src/components/utils';
import { openSendDialog } from '~/actions';

const StyledDatePicker = styled(DatePicker)`
  .rmdp-calendar {
    border-radius: 16px;
    box-shadow: none;
  }

  .rmdp-header {
    background-color: #211c18;
  }

  .rmdp-header-values {
    color: #bcc3c9;
    font-family: Poppins;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.38px;
    margin: inherit;
    margin-right: auto;
    padding-left: 36px;
  }

  .rmdp-range {
    background-color: ${({ theme }) => theme.palette.background.separator};
    color: ${({ theme }) => theme.palette.text.white};
    box-shadow: none;
  }

  .rmdp-range.start,
  .rmdp-range.end {
    ${goldenGradient('background')};
    color: #000000;
  }

  .rmdp-day {
    color: ${({ theme }) => theme.palette.text.normal};
    width: 46.429px;
    height: 38.286px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: -0.32px;
  }

  .rmdp-arrow-container {
    &:hover {
      ${goldenGradient('background')};
      color: #000000;
    }
    margin: 0 12px;
  }

  .rmdp-day span {
    &:hover {
      ${goldenGradient('background')};
      color: #000000;
    }
  }

  .rmdp-week-day,
  .rmdp-day.rmdp-deactive {
    color: ${({ theme }) => theme.palette.text.muted};
    font-size: 12px;
    font-weight: 400;
  }

  .rmdp-day-picker {
    background-color: ${({ theme }) => theme.palette.background.input};
    padding: 16px;
  }

  .rmdp-year-picker,
  .rmdp-month-picker {
    background-color: ${({ theme }) => theme.palette.background.input};
  }

  .rmdp-wrapper {
    background-color: transparent;
  }

  .rmdp-top-class {
    background: linear-gradient(
      to bottom,
      #211c18 0% 39px,
      ${({ theme }) => theme.palette.background.input} 248px 100%
    );
    border-radius: 16px;
  }

  .rmdp-arrow {
    border: solid ${({ theme }) => theme.palette.border.muted};
    border-width: 0 2px 2px 0;
  }

  .rmdp-day.rmdp-selected span:not(.highlight) {
    ${goldenGradient('background')};
    box-shadow: 0 0 3px #8798ad;
    color: #000000;
  }

  .rmdp-shadow {
    box-shadow: 4px 4px 32px 4px #0f0d0b;
  }

  span.rmdp-arrow-container.rmdp-right {
    margin-right: 26px;
  }
`;

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      <Flex direction="column" grow={1} $alignSelf="start">
        <StyledDatePicker
          range
          highlightToday={false}
          showOtherDays
          weekStartDayIndex={1}
          headerOrder={['MONTH_YEAR', 'LEFT_BUTTON', 'RIGHT_BUTTON']}
          render={(value, openCalender) => (
            <MiniContainer onClick={openCalender} iconVariant="grey">
              <CalendarIcon width="18px" height="20px" />
            </MiniContainer>
          )}
        />
      </Flex>
    </Container>
  );
};
