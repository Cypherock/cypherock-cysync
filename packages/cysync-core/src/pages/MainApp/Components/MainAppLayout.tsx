import { Flex, MainAppBody } from '@cypherock/cysync-ui';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { AppUpdateBar, Topbar } from '~/components';

import { SideBar } from './SideBar';

interface MainAppLayoutProps {
  title: string;
  children?: ReactNode;
  fullHeight?: boolean;
}

export const MainAppLayout: FC<MainAppLayoutProps> = ({
  title,
  children,
  fullHeight,
}) => {
  const topbarRef = useRef<HTMLDivElement>(null);
  const [topbarHeight, setTopbarHeight] = useState(0);

  const onResize = () => {
    setTopbarHeight(topbarRef.current?.clientHeight ?? 0);
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
          <Topbar title={title} />
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
  fullHeight: false,
};
