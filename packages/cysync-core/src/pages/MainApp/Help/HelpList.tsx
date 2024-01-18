import React, { FC, useState } from 'react';
import styled from 'styled-components';
import {
  TableStructure as BaseTableStructure,
  TableSearch,
  Typography,
  ArrowForward,
  ArrowDown,
  ArrowBackward,
  ArrowUp,
  PolygonRight,
} from '@cypherock/cysync-ui';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';
import { ListRowProps } from 'react-virtualized';
import { useDispatch } from 'react-redux';
import { openContactSupportDialog, openVideoDialog } from '~/actions';
import { NoResult } from './NoResult';

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 40px;
  overflow: hidden;
  gap: 48px;
  background: ${({ theme }) => theme.palette.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.title};
  width: 100%;
`;

const DetailsContainer = styled.div`
  height: 800px;
  width: 100%;
  border-left: 1px solid black;
  padding-left: 15px;
`;

const HelpContent: FC = () => {
  const data = [
    {
      account: 'Getting Started',
      subList: {
        1: {
          listName:
            'Jelly-o jelly-o topping topping chocolate jelly chocolate bar gummies. Halvah pudding sweet jelly-o tootsie roll?',
          video: 'https://www.youtube.com/embed/4OxSWSlRnvo?si=PSsnP-tBp8NzBQq',
          content:
            'Dessert ice cream soufflé I love cake dessert I love dragée',
          about1:
            'Sesame snaps jelly topping cheesecake lemon drops. Sugar plum macaroon chocolate bar brownie sweet roll donut dragée. Cake halvah danish jelly-o jelly halvah. Fruitcake oat cake jujubes liquorice muffin jelly-o chocolate cake. Cupcake macaroon bonbon bonbon liquorice marshmallow carrot cake apple pie. Cheesecake gingerbread pie brownie icing. Lemon drops pie biscuit powder marzipan brownie croissant cookie. Gingerbread muffin cake biscuit marshmallow croissant marzipan. Shortbread sweet roll icing jelly oat cake carrot cake jelly-o.',
          content2: 'Jelly beans cheesecake marshmallow I love oat cakes',
          about2:
            'Croissant pastry cake toffee pie pie candy canes tootsie roll soufflé. Carrot cake shortbread gummies brownie tootsie roll liquorice croissant chocolate bar. Gummies croissant sesame snaps donut soufflé. Muffin cookie donut fruitcake danish candy. Dessert cotton candy jelly-o cheesecake chupa chups bear claw sweet roll apple pie chocolate bar. Pie lemon drops lemon drops cotton candy gingerbread marzipan tart cheesecake powder. Sweet sweet caramels jelly pie macaroon. Brownie gummies jelly oat cake marshmallow. Candy pudding jelly beans fruitcake topping lemon drops jujubes cookie pie.',
          about3:
            'Cake muffin cake gummi bears macaroon chocolate bar chupa chups. Bear claw sugar plum sesame snaps lollipop jelly beans gummi bears. Caramels pie cheesecake dessert lemon drops. Cake dragée pudding bonbon tiramisu chupa chups. Brownie gingerbread sugar plum sugar plum sugar plum chocolate candy. Ice cream danish pastry pudding croissant tart. Gummi bears tart sugar plum bonbon muffin. Shortbread pastry candy canes cupcake sesame snaps chocolate cake chocolate pie ice cream.' +
            'Marshmallow chocolate pudding gummies cake cake gummi bears. Toffee tootsie roll powder biscuit candy. Brownie tiramisu lemon drops croissant shortbread marzipan soufflé sweet bonbon. Liquorice jelly beans jelly beans marshmallow tart toffee sweet roll ice cream. Tootsie roll muffin dessert jelly jelly-o gummi bears lemon drops. Cupcake gingerbread cake tart tootsie roll gummi bears gummies bonbon chocolate bar.' +
            'Bonbon toffee tiramisu powder cheesecake cake dessert jujubes. Gummies biscuit tart cookie dragée. Cake shortbread ice cream dragée chupa chups pie. Cheesecake jelly gummies chocolate bar wafer fruitcake. Muffin marzipan muffin carrot cake carrot cake chocolate cake topping. Sweet jelly fruitcake chocolate lollipop jelly beans topping. Liquorice chocolate marshmallow sweet roll jujubes tootsie roll tiramisu.',
        },
        2: {
          listName:
            'Sweet roll wafer danish sesame snaps marshmallow marzipan chupa chups macaroon?',
          video: 'https://www.youtube.com/embed/4OxSWSlRnvo?si=PSsnP-tBp8NzBQq',
          content: 'Some content here with some more data',
        },
        3: {
          listName:
            'Apple pie bear claw brownie cheesecake dragée gummi bears cake cookie?',
          video: '',
          content: 'Some content here with some more data',
        },
        4: {
          listName:
            'Tart marzipan powder chocolate bar sesame snaps. Jelly beans icing donut dessert chupa chups sweet roll wafer gingerbread?',
          content: 'Some content here with some more data',
        },
      },
    },
    {
      account: 'Features',
      subList: {
        1: {
          listName: 'list 3',
          video: 'https://www.youtube.com/embed/4OxSWSlRnvo?si=PSsnP-tBp8NzBQq',
          content: ' SOme content here with some more data',
        },
        2: {
          listName: 'list 4',
          video: '',
          content: ' SOme content here with some more data',
        },
      },
    },
    {
      account: 'Security',
      subList: {
        1: {
          listName: 'list 5',
          video: '',
          content: ' SOme content here with some more data',
        },
        2: {
          listName: 'list 6',
          video: '',
          content: ' SOme content here with some more data',
        },
      },
    },
    {
      account: 'Authentication',
      subList: {
        1: {
          listName: 'list 7',
          video: '',
          content: ' SOme content here with some more data',
        },
        2: {
          listName: 'list 8',
          video: '',
          content: ' SOme content here with some more data',
        },
      },
    },
    {
      account: 'Transactions',
      subList: {
        1: {
          listName: 'list 9',
          video: '',
          content: ' SOme content here with some more data',
        },
        2: {
          listName: 'list 10',
          video: '',
          content: ' SOme content here with some more data',
        },
      },
    },
    {
      account: 'Updates',
      subList: {
        1: {
          listName: 'list 9',
          video: '',
          content: ' SOme content here with some more data',
        },
        2: {
          listName: 'list 10',
          video: '',
          content: ' SOme content here with some more data',
        },
      },
    },
    {
      account: 'Product Usage',
      subList: {
        1: {
          listName: 'list 9',
          video: '',
          content: ' SOme content here with some more data',
        },
        2: {
          listName: 'list 10',
          video: '',
          content: ' SOme content here with some more data',
        },
      },
    },
    {
      account: '',
    },
    {
      account: 'Support',
    },
  ];

  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeSubListItem, setActiveSubListItem] = useState<number | null>(
    null,
  );

  const handleCallSupport = () => {
    dispatch(openContactSupportDialog());
  };

  const handleItemClick = (account: string) => {
    if (account === 'Support') {
      handleCallSupport();
    } else {
      setActiveItem(account);
      setIsActive(true);
    }
  };

  const handleSubListItemClick = (index: number) => {
    setActiveSubListItem(prev => (prev === index ? null : index));
  };

  const handleBackClick = () => {
    setIsActive(false);
    setActiveSubListItem(null);
  };

  const rowRenderer = ({ key, index }: ListRowProps) => {
    const item = data[index];
    return (
      <div key={key} style={{ display: 'flex', width: '100%' }}>
        <RowContainer>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '40%',
            }}
          >
            <Typography>{item.account}</Typography>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '60%',
            }}
          >
            {item.account && (
              <ArrowForward onClick={() => handleItemClick(item.account)} />
            )}
          </div>
        </RowContainer>
      </div>
    );
  };

  const updatedDiRenderer = () => {
    const selectedItem = data.find(item => item.account === activeItem);
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <RowContainer>
          <div style={{ width: '30%' }}>
            {data.map(item => (
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid gray',
                  height: '85px',
                  alignItems: 'center',
                }}
                key={item.account}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '40%',
                  }}
                >
                  <Typography>{item.account}</Typography>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '60%',
                  }}
                >
                  {item.account &&
                    (isActive && activeItem === item.account ? (
                      <ArrowBackward onClick={handleBackClick} />
                    ) : (
                      <ArrowForward
                        onClick={() => handleItemClick(item.account)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ width: '70%' }}>
            <DetailsContainer>
              {selectedItem?.subList &&
                Object.entries(selectedItem.subList).map(([key, subItem]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      borderBottom: '1px solid gray',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        height: '150px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          width: '80%',
                        }}
                      >
                        <Typography>{subItem.listName}</Typography>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          width: '10%',
                        }}
                      >
                        {activeSubListItem === parseInt(key, 10) ? (
                          <ArrowUp
                            onClick={() =>
                              handleSubListItemClick(parseInt(key, 10))
                            }
                          />
                        ) : (
                          <ArrowDown
                            onClick={() =>
                              handleSubListItemClick(parseInt(key, 10))
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      {activeSubListItem === parseInt(key, 10) && (
                        <div>
                          <div style={{ color: 'white' }}>
                            {subItem.content}
                          </div>
                          {subItem.video.length > 0 && (
                            <button
                              style={{
                                borderRadius: '50px',
                                background: 'rgb(57, 50, 44)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '16px',
                                color: 'gray',
                                boxShadow: 'none',
                                outline: 'none',
                                borderColor: 'transparent',
                                marginTop: '10px',
                                marginBottom: '10px',
                              }}
                              type="button"
                              onClick={() =>
                                dispatch(
                                  openVideoDialog({
                                    src: subItem.video,
                                  }),
                                )
                              }
                            >
                              Watch Video
                              <PolygonRight style={{ paddingLeft: '5px' }} />
                            </button>
                          )}
                          <div style={{ color: 'gray' }}>{subItem.about1}</div>
                          <div style={{ color: 'white' }}>
                            {subItem.content2}
                          </div>
                          <div style={{ color: 'gray' }}>{subItem.about2}</div>
                          <div style={{ color: 'gray' }}>{subItem.about3}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </DetailsContainer>
          </div>
        </RowContainer>
      </div>
    );
  };

  return (
    <BaseTableStructure mt={0}>
      <TableSearch
        placeholder="Search..."
        value=""
        onChange={() => console.log('Test')}
      />
      {data.length > 0 ? (
        <div>
          {isActive ? (
            updatedDiRenderer()
          ) : (
            <Virtualize.AutoSizer>
              {({ width }: any) => (
                <Virtualize.List
                  height={600}
                  width={width}
                  rowCount={data.length}
                  rowHeight={70}
                  rowRenderer={rowRenderer}
                />
              )}
            </Virtualize.AutoSizer>
          )}
        </div>
      ) : (
        <NoResult searchTerm="" handleCallSupport={handleCallSupport} />
      )}
    </BaseTableStructure>
  );
};

export default HelpContent;
