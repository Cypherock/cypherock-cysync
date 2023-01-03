import { DefaultDialogueContainer } from "../../styles/ReusableComponents/DefaultDialogueContainer.styled";
import { Button } from "../../styles/ReusableComponents/button.style";
import {
  HeadingFive,
  HeadingSix,
  HeadingSmallest,
} from "../../styles/ReusableComponents/Heading.styled";
import { SquareCheckBox } from "../../styles/ReusableComponents/Checkbox/SquareCheckBox.styled";
import { useState } from "react";

export const DialogueTerms = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <DefaultDialogueContainer>
      <div className="default-dialogue__body">
        <HeadingFive textHeading center>
          Terms of use
        </HeadingFive>
        <HeadingSix textMuted center mbThree>
          Please take some time to review our Terms or Service and Privacy
          Policy
        </HeadingSix>
        {/* <div className="popup-terms_input">
          <div></div>
          <h7 className="popup-input-heading">Terms of service</h7>
          </div>
          <div className="popup-terms_input">
          <div></div>
          <h7 className="popup-input-heading">Privacy Policy</h7>
        </div> */}
        <SquareCheckBox>
          <div>
            <input
              type="checkbox"
              onClick={() => setIsChecked((wasCheched) => !wasCheched)}
            />
          </div>
        </SquareCheckBox>
        <HeadingSmallest textMuted center>
          I have read and agree with the Terms of Use and Privacy Policy
        </HeadingSmallest>
      </div>

      <div className="default-dialogue__footer">
        {isChecked ? (
          <Button button="primary">
            <span>Confirm</span>
          </Button>
        ) : (
          <Button button="secondary" disabled="true">
            <span>Confirm</span>
          </Button>
        )}
      </div>

      <div className="popup-footer"></div>
    </DefaultDialogueContainer>
  );
};
