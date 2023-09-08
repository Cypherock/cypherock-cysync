import React, { FC } from 'react';
import DatePicker from 'react-multi-date-picker';
import { styled } from 'styled-components';

import { MiniContainer } from './Table';

import { CalendarIcon } from '../../assets';
import { goldenGradient } from '../utils';

const StyledCalendar = styled(DatePicker)`
  .rmdp-wrapper.rmdp-shadow {
    box-shadow: none !important;
  }

  .rmdp-wrapper:not() {
  }
  .temp {
    background-color: '#000' !important;
  }

  div[style*='transform: translate(1348.05px, 1217px);'] {
    transform: translate(0px, 0px) !important;
  }

  .rmdp-calendar {
    border-radius: 16px;
    box-shadow: none;
  }

  .rmdp-header {
    background-color: ${({ theme }) => theme.palette.background.calendarHeader};
  }

  .rmdp-header-values {
    background: linear-gradient(
      90deg,
      #a2adb3 0%,
      #f3f1f2 34.9%,
      #bcc3c9 65.63%,
      #dcdfe4 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    color: ${({ theme }) => theme.palette.text.black};
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
      color: ${({ theme }) => theme.palette.text.black};
    }
    margin: 0 12px;
  }

  .rmdp-day span {
    &:hover {
      ${goldenGradient('background')};
      color: ${({ theme }) => theme.palette.text.black};
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

  .rmdp-top-class {
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.palette.background.calendarHeader} 0% 39px,
      ${({ theme }) => theme.palette.background.input} 248px 100%
    );
    border-radius: 16px;
  }

  .rmdp-arrow {
    border: solid ${({ theme }) => theme.palette.border.muted};
    border-width: 0 3px 3px 0;
    font-size: 16px;
  }

  .rmdp-day.rmdp-selected span:not(.highlight) {
    ${goldenGradient('background')};
    color: ${({ theme }) => theme.palette.text.black};
  }

  span.rmdp-arrow-container.rmdp-right {
    margin-right: 26px;
  }

  .rmdp-ep-arrow[direction='top'] {
    border-bottom: none;
  }
`;

interface CalendarProps {
  value: string | undefined;
  onChange: (value: any) => void;
}

export const Calendar: FC<CalendarProps> = ({ value, onChange }) => (
  <StyledCalendar
    className="temp"
    value={value}
    onChange={onChange}
    range
    highlightToday={false}
    showOtherDays
    format="MMMM DD YYYY"
    weekStartDayIndex={1}
    dateSeparator=" to "
    headerOrder={['MONTH_YEAR', 'LEFT_BUTTON', 'RIGHT_BUTTON']}
    render={(renderedValue, openCalender) => {
      const isSelected = Boolean(renderedValue && renderedValue.includes('to'));
      return (
        <MiniContainer
          onClick={openCalender}
          variant="grey"
          selected={isSelected}
        >
          <CalendarIcon width="18px" height="20px" />
        </MiniContainer>
      );
    }}
  />
);
