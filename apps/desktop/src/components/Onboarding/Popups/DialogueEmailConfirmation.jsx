import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { DialogueSetPasswordContent } from "../../styles/Onboarding/Popups/DialogueSetPasswordContent.styled";
import { Input } from "../../styles/ReusableComponents/Input.styled";
import passwordHide from "./password-hide.png";
import { Divider } from "../../styles/ReusableComponents/Divider.styled";
import { Button } from "../../styles/ReusableComponents/button.style";

export const DialogueEmailConfirmation = () => {
  return (
    <>
      <PopupContainer>
        <DialogueSetPasswordContent>
          <div className="popup-body">
            <h5 className="popup-heading">
              You are recommended to enter an email ID as a 2FA to get
              authenticity results
            </h5>
            <h6 className="popup-subheading">
              We do not store this email ID permanently on our servers (?)
            </h6>
            <Input>
              <label>Your Email</label>
              <input type="text" placeholder="**************" />
              <img src={passwordHide} alt="" />
            </Input>

            <Divider></Divider>
            <h6 className="popup-set-password__error-text error-text">
              Password mismatch and other error messages
            </h6>
          </div>

          <div className="popup-footer">
            <Button button="secondary">
              <span>Skip</span>
            </Button>
            <Button button="primary">
              <span>Submit</span>
            </Button>
          </div>
        </DialogueSetPasswordContent>
      </PopupContainer>
    </>
  );
};
