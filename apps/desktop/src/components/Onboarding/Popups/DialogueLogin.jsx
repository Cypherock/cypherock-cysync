import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { DialogueSetPasswordContent } from "../../styles/Onboarding/Popups/DialogueSetPasswordContent.styled";
import { Input } from "../../styles/ReusableComponents/Input.styled";
import passwordHide from "./password-hide.png";
import { Divider } from "../../styles/ReusableComponents/Divider.styled";
import { Button } from "../../styles/ReusableComponents/button.style";

export const DialogueLogin = () => {
  return (
    <>
      <PopupContainer>
        <DialogueSetPasswordContent>
          <div className="popup-body">
            <h5 className="popup-heading">
              Enter password to access your portfolio
            </h5>
            <h6 className="popup-subheading">
              Your cySync password is always stored locally on your PC
            </h6>
            <Input>
              <label>Enter Password</label>
              <input type="text" placeholder="**************" />
              <img src={passwordHide} alt="" />
            </Input>

            <Divider></Divider>
            <h6 className="popup-set-password__error-text error-text">
              Your password was incorrect
            </h6>
          </div>

          <div className="popup-footer">
            <Button button="secondary">
              <span>Reset Password</span>
            </Button>
            <Button button="primary">
              <span>Login</span>
            </Button>
          </div>
        </DialogueSetPasswordContent>
      </PopupContainer>
    </>
  );
};
