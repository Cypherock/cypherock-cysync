import {
  AllocationShare,
  Container,
  LangDisplay,
  Typography,
  ListContainer,
  Flex,
  assetSwith,
  Image,
  Button
} from '@cypherock/cysync-ui';
import axios from 'axios';
import React, { useEffect, useState ,useRef } from 'react';
import { Chart, ChartData, ChartOptions } from 'chart.js/auto';
// import 'chartjs-plugin-interaction'; // Import the interaction plugin
import moment from 'moment'

const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30`

type PriceDataTuple = [number, number];

interface DateObject {
}


export const LineChart: React.FC = () => {

  const [pricedata, setPriceData] = useState<PriceDataTuple[]>([]);
  const [dates, setDates] = useState<DateObject[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;



  const labels = dates // generateRandomDataArray(5,0,10)


  function generateRandomDataArray(length:any, minValue:any, maxValue:any) {
    const dataArray = [];
  
    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      dataArray.push(randomNumber);
    }
    // console.log('dataArray: ', dataArray);
    return dataArray;
  }
  const data1: ChartData = {
    labels: labels,
    datasets: [
      {
        label: "Price",
        data: pricedata ,// generateRandomDataArray(5,0,10),// [0 , 22.74, 15.56, 13.48, 18.62, 22.71, ],
        borderColor: 'rgb(214, 0, 249)',
        tension: 0.4,
        fill: true,
        pointRadius : 0,
        hoverRadius :1,
        // lineTension: 0.1,
        backgroundColor: (context: any) => {
          // Custom gradient logic
          const chart = context.chart;
          const ctx = chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, 'rgba(214, 0, 249, 0.6)'); // Start color (opacity 0.8)
          gradient.addColorStop(1, 'rgba(214, 0, 249, 0)');   // End color (opacity 0)
          return gradient;
        },
      },
    ],
  };
  

  const options: ChartOptions = {
    
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        // beginAtZero: true,
        ticks: {
          maxTicksLimit: 5 // stepSize: 10, // Set the desired step size here (1 means show every label, 2 means show every other label, and so on)
        },
        grid: {
         color: "#4B4B4B" // borderDash: [3, 3], // Creates a dotted line for grid lines
        },
        border: {
          dash: [10,10],
      }
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
          top: 48
      }
  },
    plugins: {
        legend: {
          display: false
        },
       
    tooltip: {
      // mode: 'index', // Show tooltip based on dataset index
      // intersect: false, // Prevent hiding tooltip when hovering between points
      mode: 'nearest', // Show tooltip for the nearest point on the curve
      intersect: false, // Prevent hiding tooltip when hovering between points
      callbacks: {
        title: () => 'test', // Disable title (optional)
        label: (context) => `Value: ${context.parsed.y}`, // Show the y-axis value in the tooltip
      },
    },
  },
  };
  useEffect(() => {


  axios.get(url).then((data : any )=>{

    
    // console.log('data: ', data?.data?.prices)
    const sampleData =  data?.data?.prices
    const timestamps = [];
    
    const pricess = [];
  for (const item of sampleData) {
      const [timestamp, price] = item;
      timestamps.push(moment(timestamp).format("MMM-DD"));
      pricess.push(price);
    }
    setPriceData(pricess)
    console.log('pricess: ', pricess);
    setDates(timestamps)
    console.log('timestamps: ', timestamps);
    if (chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy previous chart instance if it exists
      }

      

      console.log('data1: ', data1);
      chartInstance = new Chart(chartRef.current, {
        type: 'line',
        data:  {
          labels: timestamps,
          datasets: [
            {
              data: pricess ,// generateRandomDataArray(5,0,10),// [0 , 22.74, 15.56, 13.48, 18.62, 22.71, ],
              borderColor: 'rgb(214, 0, 249)',
              tension: 0.9,
              fill: true,
              pointRadius : 0,
              hoverRadius :1,
              backgroundColor: (context: any) => {
                // Custom gradient logic
                const chart = context.chart;
                const ctx = chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                gradient.addColorStop(0, 'rgba(214, 0, 249, 0.6)'); // Start color (opacity 0.8)
                gradient.addColorStop(1, 'rgba(214, 0, 249, 0)');   // End color (opacity 0)
                return gradient;
              },
            },
          ],
        },
        options: options,
      });
    }
  }).catch((err)=>
  {console.log('err: ', err)})

    


    return () => {
      if (chartInstance) {
        chartInstance.destroy(); // Clean up the chart instance when the component unmounts
      }
    };
  }, []);

  return (
          <Flex
          direction="column"
          $bgColor="contentGradient"
          p={4}
          display="flex"
          height="500px"
          >
            <Flex p={3} display="flex" direction="row" justify="space-between" height="full">
              <Container width="70px"  p={1} display="flex" direction="row" justify="space-between">
                  <Typography
                    variant="h6"
                    color="muted"
                    $textAlign="left"
                    $letterSpacing={0.05}
                    p={1}
                    m={1}
                  >
                    <LangDisplay 
                    text="12.72 ETH" />
                  </Typography>
                      <Flex>
                      <Image 
                      p={1}
                      m={1}
                      position='relative'
                      src={assetSwith} 
                      alt="logo" 
                      $alignSelf="end" />
                      </Flex>
                </Container>
              <Container display="flex" direction="row" justify="space-between">
                      <Flex m="3">
                          <Button border-radius='3px' icon='1D'variant="secondary"   size="sm"  />
                      </Flex>
                      <Flex m="3">
                          <Button border-radius='3px' icon='1W' variant="secondary"  size="sm"/>
                      </Flex>
                      <Flex m="3">
                          <Button border-radius='3px'  icon='1M' variant="secondary"  size="sm"/>
                      </Flex>
                      <Flex m="3">
                          <Button border-radius='3px'  icon='1Y' variant="secondary"  size="sm"/>
                      </Flex>
                      <Flex m="3">
                          <Button border-radius='3px'  icon='ALL' variant="secondary" size="sm"/>
                      </Flex>
                </Container>
            </Flex>
        <Container>
              <canvas  ref={chartRef} />
        </Container>
            </Flex>
            )

};


