import { Aside } from "./Aside";
import { DialogueEmailConfirmation } from "./Dialogue";
import { Flex, Container } from "@components";

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
