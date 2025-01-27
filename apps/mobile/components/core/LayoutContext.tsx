// not implemented completely (for tablet screens)
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useWindowDimensions, Platform, Dimensions } from 'react-native';

interface LayoutContextProps {
  isTablet: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
}

const LayoutContext = createContext<LayoutContextProps>({
  isTablet: false,
  isLandscape: false,
  width: 0,
  height: 0,
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { width, height } = useWindowDimensions();
  const [isTablet, setIsTablet] = useState(false);
  const [isLandscape, setIsLandscape] = useState(width > height);

  useEffect(() => {
    // More robust tablet detection
    const checkIsTablet = () => {
      const aspectRatio = width / height;
      if (Platform.OS === 'ios') {
        return Platform.isPad;
      } else {
        return (
          (width >= 768 || height >= 768) && // Larger screen dimension
          aspectRatio > 0.8 &&
          aspectRatio < 1.6
        ); // Aspect ratio not too wide or too narrow
      }
    };

    setIsTablet(checkIsTablet());
    setIsLandscape(width > height);
  }, [width, height]);

  return (
    <LayoutContext.Provider value={{ isTablet, isLandscape, width, height }}>
      {children}
    </LayoutContext.Provider>
  );
};
