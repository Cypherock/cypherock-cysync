import React, { createContext, useContext, useMemo, useState } from 'react';
import { ScreenTypes } from '../enum';

const NavigationContext = createContext({});

export const NavigationProvider = ({ children }: any) => {
  // states
  const [currentScreen, setCurrentScreen] = useState(ScreenTypes.Portfolio);

  // functions
  const clickHandler = (e: any) => {
    setCurrentScreen(e.currentTarget.value);
  };

  // memos
  const valueProvider = useMemo(
    () => ({
      currentScreen,
      clickHandler,
    }),
    [currentScreen, clickHandler],
  );

  return (
    <NavigationContext.Provider value={valueProvider}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
