import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { DialogueSetPasswordContent } from "../../styles/Onboarding/Popups/DialogueSetPasswordContent.styled";
import { Input } from "../../styles/ReusableComponents/Input.styled";
import passwordHide from "./password-hide.png";
import { Divider } from "../../styles/ReusableComponents/Divider.styled";
import { Button } from "../../styles/ReusableComponents/button.style";

export const DialoguePasswordSetSuccess = () => {
  return (
    <>
      <PopupContainer>
        <DialogueSetPasswordContent>
          <div className="popup-header">Congratulations!</div>
          <div className="popup-body">
            <h5 className="popup-heading">Your new password is set</h5>
            <h6 className="popup-subheading">
              Please wait while take you to the login screen
            </h6>
          </div>

          <div className="popup-footer">
            <Button button="primary">
              <span>Go to login</span>
            </Button>
          </div>
        </DialogueSetPasswordContent>
      </PopupContainer>
    </>
  );
};
