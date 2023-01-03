import { DefaultDialogueContainer } from "../../styles/ReusableComponents/DefaultDialogueContainer.styled";
import { WelcomePopupList } from "./WelcomePopupList";
import { Button } from "../../styles/ReusableComponents/button.style";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/ReusableComponents/Heading.styled";

export const DialogueWelcome = () => {
  return (
    <>
      <DefaultDialogueContainer>
        <div className="default-dialogue__body">
          <HeadingFive textHeading center>
            Ensure the product contains the following
          </HeadingFive>
          <HeadingSix textMuted mbFour center>
            Make sure the tamper-proof seal of the package was intact
          </HeadingSix>
          {/* <WelcomePopupList /> */}

          <div className="default-dialogue__list">
            <HeadingSix textMuted>
              Please email at <span>support@cypherock.com</span> if your package
              doesn't have any of these
            </HeadingSix>
          </div>
        </div>

        <div className="default-dialogue__footer">
          <Button button="primary">
            <span>Get Started</span>
          </Button>
        </div>
      </DefaultDialogueContainer>
    </>
  );
};
