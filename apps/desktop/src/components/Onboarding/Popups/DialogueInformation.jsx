import { DialogueContainer } from "../../styles/ReusableComponents/DialogueContainer.styled";
import { PopupInformationContent } from "../../styles/Onboarding/Popups/PopupInformationContent.style";
import { HeadingFive } from "../../styles/ReusableComponents/Heading.styled";
export const DialogueInformation = () => {
  return (
    <>
      <DialogueContainer>
        <PopupInformationContent>
          <div className="dialogue-body">
            <HeadingFive textSilver center mbOne>
              Ensure the following before you continue
            </HeadingFive>
            {/* <ul className="dialogue-list">
              <li className="dialogue-list-items">
                <div></div>
                <h6>You are present in a safe and secure environment</h6>
              </li>
              <li className="dialogue-list-items">
                <div></div>
                <h6>You have atleast 15-30 minutes to setup your wallet</h6>
              </li>
              <li className="dialogue-list-items">
                <div></div>
                <h6>You have an active internet connection</h6>
              </li>
              <li className="dialogue-list-items">
                <div></div>
                <h6>The tamper-proof seal of the package is intact</h6>
              </li>
            </ul>
             */}
          </div>
        </PopupInformationContent>
      </DialogueContainer>
    </>
  );
};
