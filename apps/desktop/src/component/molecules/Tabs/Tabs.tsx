import { TabProps, TabStyle } from "./Tabs.style";

export const Tab = ({ children, ...props }: TabProps) => {
  return (
      <TabStyle {...props}>{children}</TabStyle>
  );
};
