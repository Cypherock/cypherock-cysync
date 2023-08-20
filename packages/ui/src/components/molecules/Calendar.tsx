import React, { FC } from 'react';
import DatePicker from 'react-multi-date-picker';
import { styled } from 'styled-components';
import { goldenGradient } from '../utils';
import { MiniContainer } from './Table';
import { CalendarIcon } from '../../assets';
import { CloseButton, Typography } from '../atoms';

const StyledCalendar = styled(DatePicker)`
  .rmdp-wrapper {
    box-shadow: none !important;
    background-color: transparent !important;
  }
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
    color: #000000;
  }

  .rmdp-shadow {
    box-shadow: 4px 4px 32px 4px #0f0d0b;
  }

  span.rmdp-arrow-container.rmdp-right {
    margin-right: 26px;
  }

  .rmdp-ep-arrow[direction='top'] {
    border-bottom: none;
  }
`;

const RangeContainer = styled.div<{
  iconVariant: string;
  onClick?: () => void;
}>`
  position: relative;
  display: inline-flex;
  padding: var(--0-px, 0px) var(--8-px, 8px);
  gap: var(--16-px, 16px);
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.text.heading};
  background: ${({ iconVariant, theme }) =>
    iconVariant === 'success'
      ? `rgba(81, 198, 26, 0.20)`
      : theme.palette.background.input};
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -0.36px;
    width: 6.36px;
    height: 6.36px;
    border-radius: 50%;
    ${goldenGradient('background')};
  }
  ${({ onClick }) =>
    onClick &&
    `
        &:hover {
          cursor: pointer;
        }
      `}
`;

interface CalendarProps {
  value: string | undefined;
  onChange: (value: any) => void;
}

export const Calendar: FC<CalendarProps> = ({ value, onChange }) => {
  const handleResetDate = () => {
    onChange(undefined);
  };

  return (
    <StyledCalendar
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
        if (!renderedValue) {
          return (
            <MiniContainer onClick={openCalender} iconVariant="grey">
              <CalendarIcon width="18px" height="20px" />
            </MiniContainer>
          );
        }
        const [startDate, endDate] = renderedValue.split(' to ');
        return (
          <RangeContainer onClick={openCalender} iconVariant="grey">
            <CalendarIcon width="18px" height="20px" />
            <Typography
              variant="span"
              $fontSize={12}
              display="flex"
              direction="row"
              gap={5}
            >
              {startDate}
              <Typography variant="p" $fontSize={12} color="gold">
                to
              </Typography>
              {endDate}
            </Typography>
            <CloseButton onClick={handleResetDate} />
          </RangeContainer>
        );
      }}
    />
  );
};
