import { Flex, MainAppBody } from '@cypherock/cysync-ui';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import {
  AppUpdateBar,
  DeviceUpdateBar,
  SideBar,
  Topbar,
  TopbarProps,
  Notification,
} from '~/components';

interface MainAppLayoutProps {
  topbar: TopbarProps;
  children?: ReactNode;
  fullHeight?: boolean;
  onTopbarHeightChange?: (height: number) => void;
}

const MainAppLayoutComponent: FC<MainAppLayoutProps> = ({
  topbar,
  children,
  fullHeight,
  onTopbarHeightChange,
}) => {
  const topbarRef = useRef<HTMLDivElement>(null);
  const [topbarHeight, setTopbarHeight] = useState(0);

  const calcHeight = () => {
    const height = topbarRef.current?.clientHeight ?? 0;
    if (onTopbarHeightChange) {
      onTopbarHeightChange(height);
    }
    setTopbarHeight(height);
  };

  useEffect(() => {
    calcHeight();
    window.addEventListener('resize', calcHeight);
    const interval = setInterval(calcHeight, 4 * 1000);

    return () => {
      window.removeEventListener('resize', calcHeight);
      clearInterval(interval);
    };
  }, []);

  return (
    <Flex width="full" height="full" $bgColor="contentGradient">
      <SideBar />
      <Flex $flex={1} direction="column">
        <Flex ref={topbarRef} direction="column" gap={16}>
          <AppUpdateBar />
          <DeviceUpdateBar />
          <Topbar {...topbar} />
        </Flex>
        <Notification top={topbarHeight + 5} />
        <MainAppBody $fullHeight={fullHeight} $topbarHeight={topbarHeight}>
          {children}
        </MainAppBody>
      </Flex>
    </Flex>
  );
};

MainAppLayoutComponent.defaultProps = {
  children: undefined,
  fullHeight: false,
  onTopbarHeightChange: undefined,
};

export const MainAppLayout = React.memo(MainAppLayoutComponent);
