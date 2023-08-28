import { Flex, MainAppBody, MainAppBodyWrapper } from '@cypherock/cysync-ui';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { AppUpdateBar, Topbar } from '~/components';

import { SideBar } from './SideBar';

interface MainAppLayoutProps {
  title: string;
  children?: ReactNode;
}

export const MainAppLayout: FC<MainAppLayoutProps> = ({ title, children }) => {
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
      <Flex width="full" direction="column">
        <Flex ref={topbarRef} direction="column" gap={16}>
          <AppUpdateBar />
          <Topbar title={title} />
        </Flex>
        <MainAppBodyWrapper>
          <MainAppBody $topbarHeight={topbarHeight}>{children}</MainAppBody>
        </MainAppBodyWrapper>
      </Flex>
    </Flex>
  );
};

MainAppLayout.defaultProps = {
  children: undefined,
};
