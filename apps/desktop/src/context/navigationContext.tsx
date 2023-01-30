import { createContext, useContext, useState } from "react";
import { ScreenTypes } from "@/enum";

const NavigationContext = createContext({});

export const NavigationProvider = ({ children }: any) => {
  const [currentScreen, setCurrentScreen] = useState(ScreenTypes.Portfolio);

  const clickHandler = (e: any) => {
    setCurrentScreen(e.currentTarget.value);
  };
  return (
    <NavigationContext.Provider value={{ currentScreen, clickHandler }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
