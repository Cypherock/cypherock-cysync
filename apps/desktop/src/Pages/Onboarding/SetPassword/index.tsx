import { Aside } from "./Aside/Aside";
import { DialogueEmailConfirmation } from "./Dialogue/";
import { Flex, Container } from "@/components/styles";

export const GetStarted = (): JSX.Element => {
  return (
    <>
      <Flex alignCenter contentGratient>
        <Aside />
        <Container>
          <DialogueEmailConfirmation />
        </Container>
      </Flex>
    </>
  );
};
