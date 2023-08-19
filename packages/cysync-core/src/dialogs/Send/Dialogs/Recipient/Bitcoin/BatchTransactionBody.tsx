import React, { useEffect, useRef, useState } from 'react';
import {
  Divider,
  Flex,
  Container,
  Typography,
  MiniButton,
  RecipientAddress,
  BatchContainer,
  Button,
} from '@cypherock/cysync-ui';
import { AmountToSend } from '../AmountToSend';

interface BatchTransactionBodyProps {
  text: string;
  recipient: {
    text: string;
    placeholder: string;
    error: string;
  };
  amount: {
    text: string;
    coin: string;
    toggle: string;
    dollar: string;
    error: string;
    placeholder: string;
  };
}

export const BatchTransactionBody: React.FC<BatchTransactionBodyProps> = ({
  text,
  recipient,
  amount,
}) => {
  const [addresses, setAddresses] = useState<
    { id: string; recipient: string; amount: string }[]
  >([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [throbberActiveIds, setThrobberActiveIds] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState<string[]>([]);

  const handleRecipientChange = (id: string, value: string) => {
    const showError = value.trim() === 'hello';
    if (showError) {
      setShowErrors(prevErrors => [...prevErrors, id]);
    } else {
      setShowErrors(prevErrors => prevErrors.filter(e => e !== id));
    }

    setAddresses(
      addresses.map(c => (c.id === id ? { ...c, recipient: value } : c)),
    );

    if (!throbberActiveIds.includes(id)) {
      setThrobberActiveIds([...throbberActiveIds, id]);
      setTimeout(() => {
        setThrobberActiveIds(prevIds =>
          prevIds.filter(prevId => prevId !== id),
        );
      }, 2000);
    }
  };

  const handleButtonClick = () => {
    const uniqueId = `${Date.now()}-${Math.random()}`;
    setAddresses([...addresses, { id: uniqueId, recipient: '', amount: '' }]);
  };

  const handleDeleteClick = (id: string) => {
    setAddresses(addresses.filter(component => component.id !== id));
  };

  const handleAmountChange = (id: string, val: string) => {
    setAddresses(
      addresses.map(component =>
        component.id === id ? { ...component, val } : component,
      ),
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      const lastChild = containerRef.current.lastElementChild;
      lastChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [addresses]);

  return (
    <BatchContainer ref={containerRef}>
      <Container
        display="flex"
        justify="space-between"
        align="center"
        direction="column"
      >
        <Flex gap={16} direction="column">
          {addresses.map((address, i) => (
            <>
              <RecipientAddress
                key={`recipient-${address.id}`}
                text={recipient.text}
                placeholder={recipient.placeholder}
                error={
                  showErrors.includes(address.id) ? recipient.error : undefined
                }
                isThrobberActive={throbberActiveIds.includes(address.id)}
                deleteButton
                onDelete={() => handleDeleteClick(address.id)}
                value={address.recipient}
                onChange={(recip: string) =>
                  handleRecipientChange(address.id, recip)
                }
              />
              <AmountToSend
                key={`amount-${address.id}`}
                text={amount.text}
                coin={amount.coin}
                toggle={amount.toggle}
                dollar={amount.dollar}
                error={amount.error}
                placeholder={amount.placeholder}
                value={address.amount}
                onChange={(val: string) => handleAmountChange(address.id, val)}
              />
              {i !== addresses.length - 1 && <Divider variant="horizontal" />}
            </>
          ))}
        </Flex>
        <Button
          onClick={handleButtonClick}
          $bgColor="separatorSecondary"
          width="full"
          display="flex"
          align="center"
          justify="center"
          p={1}
          $borderRadius={8}
          gap={16}
          mt={2}
        >
          <Typography $fontSize={13} $fontWeight="normal" color="muted">
            {text}
          </Typography>
          <MiniButton>+</MiniButton>
        </Button>
      </Container>
    </BatchContainer>
  );
};
