import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Divider } from './Divider';
import { Flex } from './Flex';
import { MiniButton } from './MiniButton';
import { Typography } from './Typography';

import { AmountToSend, RecipientAddress } from '../molecules';

interface BatchTransactionBodyProps {
  text: string;
  batch: any;
}

const Container = styled.div`
  background-color: ${({ theme }) =>
    theme.palette.background.batchTransactionBody};
  padding: 16px;
  border-radius: 8px;
  width: 100%;
  max-height: 458px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  gap: 16px;
  margin-top: 16px;
  cursor: pointer;
`;

export const BatchTransactionBody: React.FC<BatchTransactionBodyProps> = ({
  text,
  batch,
}) => {
  const [components, setComponents] = useState<
    Array<{ id: string; recipient: string; amount: string }>
  >([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleButtonClick = () => {
    const uniqueId = `${Date.now()}-${Math.random()}`;
    setComponents([...components, { id: uniqueId, recipient: '', amount: '' }]);
  };

  const handleDeleteClick = (id: string) => {
    setComponents(components.filter(component => component.id !== id));
  };

  const handleRecipientChange = (id: string, recipient: string) => {
    setComponents(
      components.map(component =>
        component.id === id ? { ...component, recipient } : component,
      ),
    );
  };

  const handleAmountChange = (id: string, amount: string) => {
    setComponents(
      components.map(component =>
        component.id === id ? { ...component, amount } : component,
      ),
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      const lastChild = containerRef.current.lastElementChild;
      lastChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [components]);

  return (
    <Container ref={containerRef}>
      <FlexContainer>
        <Flex gap={16} direction="column">
          {components.map((component, i) => (
            <>
              <RecipientAddress
                key={`recipient-${component.id}`}
                text={batch.recipient.text}
                placeholder={batch.recipient.placeholder}
                error={batch.recipient.error}
                deleteButton
                onDelete={() => handleDeleteClick(component.id)}
                value={component.recipient}
                onChange={recipient =>
                  handleRecipientChange(component.id, recipient)
                }
              />
              <AmountToSend
                key={`amount-${component.id}`}
                text={batch.amount.text}
                coin={batch.amount.coin}
                toggle={batch.amount.toggle}
                dollar={batch.amount.dollar}
                error={batch.amount.error}
                placeholder={batch.amount.placeholder}
                value={component.amount}
                onChange={amount => handleAmountChange(component.id, amount)}
              />
              {i !== components.length - 1 && <Divider variant="horizontal" />}
            </>
          ))}
        </Flex>
        <Button onClick={handleButtonClick}>
          <Typography $fontSize={13} $fontWeight="normal" color="muted">
            {text}
          </Typography>
          <MiniButton shape="+" />
        </Button>
      </FlexContainer>
    </Container>
  );
};
