import { Chart, ChartOptions } from 'chart.js/auto';
import { format as formatDate } from 'date-fns';
import React, { useRef, useEffect } from 'react';

import { Container } from '../../atoms';

export interface LineGraphProps {
  data: {
    timestamp: number;
    value: number;
  }[];
  formatTooltipValue?: (params: { timestamp: number; value: number }) => string;
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
  color,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | undefined>(undefined);

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        // beginAtZero: true,
        ticks: {
          maxTicksLimit: 5, // stepSize: 10, // Set the desired step size here (1 means show every label, 2 means show every other label, and so on)
        },
        grid: {
          color: '#4B4B4B', // borderDash: [3, 3], // Creates a dotted line for grid lines
        },
        border: {
          dash: [10, 10],
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 5, // Set the desired step size here (1 means show every label, 2 means show every other label, and so on)
        },
        display: true,
        grid: {
          display: false, // Hide vertical grid lines on the x-axis
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
        // mode: 'index', // Show tooltip based on dataset index
        // intersect: false, // Prevent hiding tooltip when hovering between points
        mode: 'nearest', // Show tooltip for the nearest point on the curve
        intersect: false, // Prevent hiding tooltip when hovering between points
        callbacks: {
          title: () => '',
          label: context =>
            formatTooltipValue
              ? formatTooltipValue({
                  timestamp: context.parsed.x,
                  value: context.parsed.y,
                })
              : context.parsed.y.toString(), // Show the y-axis value in the tooltip
        },
      },
    },
  };

  const getChartData = () => {
    const timestamps = [];
    const values = [];

    for (const item of data) {
      timestamps.push(formatDate(item.timestamp, 'MMM d'));
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
};
