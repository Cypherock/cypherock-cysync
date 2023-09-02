import {
  AllocationShare,
  Container,
  LangDisplay,
  Typography,
  ListContainer,
  Flex,
  assetSwith,
  Image,
  walletIcon,
  DropDownListItemProps,
  ImageProps,
  bitcoinIcon,
  Button,
  tabler_graph,
  Dropdown,
  WalletIcon,
  solanaIcon,
  binanceIcon,
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import axios from 'axios';
import React, { useEffect, useState ,useRef , useMemo } from 'react';
import { Chart, ChartData, ChartOptions } from 'chart.js/auto';
// import 'chartjs-plugin-interaction'; // Import the interaction plugin
import moment from 'moment'

const url = `https://api.coingecko.com/api/v3/coins/curve-dao-token/market_chart?vs_currency=usd&days=365`

type PriceDataTuple = [number, number];

interface DateObject {
}
interface ClickableComponentProps {
  onClick: () => void;
}

const dropDownDataWithWallet: DropDownListItemProps[] = [
  {
    id: '51',
    text: 'Official',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
  {
    id: '52',
    text: 'Cypherock Red',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
  {
    id: '53',
    text: 'Personal',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
  {
    id: '54',
    text: 'Business',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
];

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
        tension: 0.5,
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


  const onClick = () => {
    console.log('e: ');
  }
  useEffect(() => {
  axios.get(url).then((data : any )=>{
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
              tension: 1,
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
            <Container  display="flex" direction="row" justify="space-between" height="full">
           
           {/* left side top info  */}
            <Container 
            pl="40" 
            pr="40" 
            pt="32" 
            pb="32" 
            display="flex" direction="column">
            <Container 
            width='full'
            justify= "flex-start"
            >

              <Container
               pb="4" 
               border-bottom="1px solid #2C2520"
              width="fit-content" display="flex" direction="row"  align-items= "flex-start" justify= "flex-start" >
                  <Typography
                    variant="h3"
                    $textAlign="left"
                    $letterSpacing={0.05}
                    pr={1}
                    leading-trim='both'
                    text-edge='cap'
                    font-family='Poppins'
                    font-size='32px'
                    font-style='normal'
                    font-weight='600'
                    line-height='normal'
                  >12.72 ETH
                    {/* <LangDisplay 
                  font-weight='600'
                   text="12.72 ETH" /> */}
                  </Typography>
                      <Image2
                      onClick={onClick}
                      pl="16"
                      src={assetSwith} 
                      alt="logo" 
                      />
              </Container>
            </Container>
              <Container 
              pt="4" 
               gap={8} display="flex" direction="row" align-items= "flex-start"  justify="center">
                <Typography
                    color="muted"
                    $textAlign="left"
                    $letterSpacing={0.02}
                    >$ 16032.087</Typography>
                    <Typography
                    color="muted"
                    $textAlign="left"
                    $letterSpacing={0.02}
                    direction="row"
                    display='flex'
                    >
                    <Flex 
                     direction="row" display="block" align-items= "center" justify="center" >
                      <Image
                      align-items= "center"
                      justify="center"
                      position='relative'
                      src={tabler_graph} 
                      alt="logo" 
                      $alignSelf="end"
                      pr='8' />
                    </Flex>1 ETH = $ 1,258.47</Typography>
              </Container>
            </Container>


            {/* buttonns and Drop down */}
              <Container  display="flex" direction="row" >
              <Container width={246} gap={8} align-items="center">
                          <Button border-radius='3px' icon='1D'variant="secondary"   size="sm"  />
                          <Button border-radius='3px' icon='1W' variant="secondary"  size="sm"/>
                          <Button border-radius='3px'  icon='1M' variant="secondary"  size="sm"/>
                          <Button border-radius='3px'  icon='1Y' variant="secondary"  size="sm"/>
                          <Button border-radius='3px'  icon='ALL' variant="secondary" size="sm"/>
                      </Container>
                      <Container
                      width="250"
                      // display="flex"
                      height="24"
                      p="12"
                      justify-content= "space-between"
                      // align-items= "center"
                     >
                      <Dropdown
                        align-items= "center"
                        justify-content= "space-between"
                        items={dropDownDataWithWallet}
                        selectedItem={"test"}
                        disabled={false}
                        searchText={"test"}
                        placeholderText={"All Wallets"}
                        onChange={onClick}
                        leftImage={<Image src={walletIcon} alt="wallet icon" ml={3} />}
                        />
                    </Container>
                </Container>
            </Container>


            {/* mid line */} 
            <Container 
            display= "flex"
            align-self= "stretch"
            pl='40' width='full' 
            gap={8} 
            align-items="center"
            justify='flex-start'>
              <svg height='15' width='15'>
              <polygon points="8.66,0 0,15 17.32,15" fill='lime' stroke='purple' stroke-width='1px' />
              Green Arrow
            </svg>
            <Typography
                    color="muted"
                    $textAlign="left"
                    $letterSpacing={0.02}
                    direction="row"
                    display='flex'
                    font-family='Poppins'
                    align-self="stretch"
                    gap={8} 
                  >
                    <LangDisplay  text="2.3%" />
                    <LangDisplay  text="$ 00.321" />
                  </Typography>
            </Container>

            {/* Graph  */}
        <Container>
              <canvas  ref={chartRef} />
        </Container>
            </Flex>
            )

};

import styled from 'styled-components';
import { string } from 'prop-types';



interface graphImageProps extends ImageProps {
  src: string;
  alt: string;
  onClick : any;
}

const StyledImage = styled.img<graphImageProps>`
  display: flex;
  width: 32px;
  padding: 5px;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1.5px solid #45413E;
  background: #39322C;
  box-shadow: 4px 4px 32px 4px #0F0D0B;
`;

const Image2: React.FC<graphImageProps> = ({ onClick , src, alt ,...props }) => {
  return <StyledImage {...props} onClick={onClick} src={src} alt={alt} />;
};

export default Image2;
