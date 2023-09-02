import { useState } from 'react';

export const useAccordion = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggleAccordion };
};
