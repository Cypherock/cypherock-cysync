import {
  Chart,
  ChartOptions,
  ChartType,
  TooltipModel,
  TooltipOptions,
} from 'chart.js/auto';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { LineGraphTooltip, LineGraphTooltipState } from './Tooltip';

import { ThemeProvider, useTheme } from '../../../../themes';
import { Container } from '../../../atoms';

export interface LineGraphProps {
  data: {
    timestamp: number;
    value: number;
  }[];
  formatYAxisTick?: (value: number | string) => string | number;
  formatTooltipValue?: (params: {
    timestamp: number;
    value: number;
  }) => string[];
  formatTimestamp?: (timestamp: number) => string;
  color: string;
}

const hexToRGB = (value: string) => {
  const numericValue = parseInt(value.replace('#', ''), 16);
  // eslint-disable-next-line no-bitwise
  const r = (numericValue >> 16) & 0xff;
  // eslint-disable-next-line no-bitwise
  const g = (numericValue >> 8) & 0xff;
  // eslint-disable-next-line no-bitwise
  const b = numericValue & 0xff;
  return { r, g, b };
};

export const LineGraph: React.FC<LineGraphProps> = ({
  data,
  formatTooltipValue,
  formatTimestamp,
  formatYAxisTick,
  color,
}) => {
  const theme = useTheme();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | undefined>(undefined);

  const tooltipRoot = useRef<ReactDOM.Root | undefined>(undefined);
  const tooltipUpdateMethod = useRef<
    ((state: LineGraphTooltipState) => void) | undefined
  >(undefined);

  const getTooltipProps = (
    chart: Chart,
    tooltip: TooltipModel<ChartType>,
  ): LineGraphTooltipState => {
    if (!tooltip.dataPoints || tooltip.dataPoints.length === 0)
      return {
        values: [],
        isVisible: false,
        chartPadding: 0,
        pointX: 0,
        pointY: 0,
        chartWidth: 0,
        chartHeight: 0,
        chartTop: 0,
        chartLeft: 0,
      };

    const dataPoint = tooltip.dataPoints[0];

    const { timestamp, value } = data[dataPoint.dataIndex] ?? {
      timestamp: 0,
      value: 0,
    };
    const chartRect = chart.canvas.getBoundingClientRect();

    return {
      values: formatTooltipValue
        ? formatTooltipValue({ timestamp, value })
        : [value.toString()],
      chartHeight: chart.canvas.clientHeight,
      chartWidth: chart.canvas.clientWidth,
      chartTop: chartRect.top,
      chartLeft: chartRect.left,
      pointX: tooltip.caretX,
      pointY: tooltip.caretY,
      isVisible: tooltip.opacity !== 0 && data.length > dataPoint.dataIndex,
      chartPadding: 40,
    };
  };

  const externalTooltipHandler: TooltipOptions['external'] = context => {
    const { chart, tooltip } = context;

    if (!chart.canvas.parentNode) return;

    if (!tooltipRoot.current) {
      const tooltipElContainer = document.createElement('div');

      chart.canvas.parentNode.appendChild(tooltipElContainer);

      const tooltipElement = (
        <ThemeProvider theme={theme}>
          <LineGraphTooltip
            getUpdateMethod={updateMethod => {
              updateMethod(getTooltipProps(chart, tooltip));
              tooltipUpdateMethod.current = lodash.debounce(updateMethod, 20);
            }}
          />
        </ThemeProvider>
      );
      const root = ReactDOM.createRoot(tooltipElContainer);
      root.render(tooltipElement);
      tooltipRoot.current = root;
    }

    if (tooltipUpdateMethod.current) {
      tooltipUpdateMethod.current(getTooltipProps(chart, tooltip));
    }
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 5,
          callback: label => (formatYAxisTick ? formatYAxisTick(label) : label),
        },
        grid: {
          color: '#4B4B4B',
        },
        border: {
          dash: [10, 10],
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 5,
        },
        display: true,
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        left: 40,
        right: 40,
        top: 48,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        intersect: false,
        position: 'nearest',
        external: externalTooltipHandler,
      },
    },
    animation: false,
    animations: {
      colors: false,
      x: false,
    },
    transitions: {
      active: {
        animation: {
          duration: 0,
        },
      },
    },
  };

  const getChartData = () => {
    const timestamps = [];
    const values = [];

    for (const item of data) {
      timestamps.push(
        formatTimestamp
          ? formatTimestamp(item.timestamp)
          : formatDate(item.timestamp, 'MMM d'),
      );
      values.push(item.value);
    }

    return {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            data: values,
            borderColor: color,
            tension: 0,
            fill: true,
            pointRadius: 0,
            hoverRadius: 1,
            backgroundColor: (context: any) => {
              const { chart } = context;
              const { ctx } = chart;
              const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
              const colorRgb = hexToRGB(color);
              gradient.addColorStop(
                0,
                `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.6)`,
              );
              gradient.addColorStop(
                1,
                `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0)`,
              );
              return gradient;
            },
          },
        ],
      },
      options,
    };
  };

  useEffect(() => {
    if (chartRef.current) {
      chartInstanceRef.current = new Chart(
        chartRef.current,
        getChartData() as any,
      );
    }

    return () => {
      setTimeout(() => {
        if (tooltipRoot.current) {
          tooltipRoot.current.unmount();
        }
      });

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      const chartData = getChartData();
      chartInstanceRef.current.data = chartData.data;
      chartInstanceRef.current.options = chartData.options;
      chartInstanceRef.current.update();
    }
  }, [data, formatTooltipValue]);

  return (
    <Container position="absolute" top={0} left={0} width="full" height="full">
      <canvas ref={chartRef} />
    </Container>
  );
};

LineGraph.defaultProps = {
  formatTooltipValue: undefined,
  formatTimestamp: undefined,
  formatYAxisTick: undefined,
};
