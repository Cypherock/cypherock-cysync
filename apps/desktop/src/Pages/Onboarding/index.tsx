import { Typography, Flex, Container } from "@/component";
import { AsideOnboarding } from "./Aside/Aside";
import { GetStarted } from "./GetStarted";

export const OnboradingMain = (): JSX.Element => {
  return (
    <>
      <Flex>
        <AsideOnboarding />
        <GetStarted />
      </Flex>
    </>
  );
};
