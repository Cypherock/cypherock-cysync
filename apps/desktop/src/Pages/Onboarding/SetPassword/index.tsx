import { Aside } from "./Aside/Aside";
import { DialogueEmailConfirmation } from "./Dialogue/";
import { Flex, Container } from "@/cysync-ui";

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
