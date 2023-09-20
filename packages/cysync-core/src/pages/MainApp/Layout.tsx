import { Flex, MainAppBody } from '@cypherock/cysync-ui';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { AppUpdateBar, DeviceUpdateBar, SideBar, Topbar } from '~/components';

interface MainAppLayoutProps {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  fullHeight?: boolean;
  onTopbarHeightChange?: (height: number) => void;
}

export const MainAppLayout: FC<MainAppLayoutProps> = ({
  title,
  icon,
  children,
  fullHeight,
  onTopbarHeightChange,
}) => {
  const topbarRef = useRef<HTMLDivElement>(null);
  const [topbarHeight, setTopbarHeight] = useState(0);

  const onResize = () => {
    const height = topbarRef.current?.clientHeight ?? 0;
    if (onTopbarHeightChange) {
      onTopbarHeightChange(height);
    }
    setTopbarHeight(height);
  };

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <Flex width="full" height="full" $bgColor="contentGradient">
      <SideBar />
      <Flex $flex={1} direction="column">
        <Flex ref={topbarRef} direction="column" gap={16}>
          <AppUpdateBar />
          <DeviceUpdateBar />
          <Topbar icon={icon} title={title} />
        </Flex>
        <MainAppBody $fullHeight={fullHeight} $topbarHeight={topbarHeight}>
          {children}
        </MainAppBody>
      </Flex>
    </Flex>
  );
};

MainAppLayout.defaultProps = {
  children: undefined,
  icon: undefined,
  fullHeight: false,
  onTopbarHeightChange: undefined,
};
