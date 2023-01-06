import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { DialogueSetPasswordContent } from "../../styles/Onboarding/Popups/DialogueSetPasswordContent.styled";
import { Input } from "../../styles/ReusableComponents/Input.styled";
import passwordHide from "./password-hide.png";
import { Divider } from "../../styles/ReusableComponents/Divider.styled";
import { Button } from "../../styles/ReusableComponents/button.style";

export const DialogueSetPassword = () => {
  return (
    <>
      <PopupContainer>
        <DialogueSetPasswordContent>
          <div className="popup-body">
            <h5 className="popup-heading">Set your cySync password</h5>
            <h6 className="popup-set-Password__active-text">
              We do not store your password on our servers.
            </h6>
            <div className="popup-set-password__info active-text small-text">
              This protects your privacy around your Crypto assets.
            </div>
            <Input>
              <label>New Password</label>
              <input type="text" placeholder="**************" />
              <img src={passwordHide} alt="" />
            </Input>

            <Input>
              <label>Confirm Password</label>
              <input type="text" placeholder="**************" />
              <img src={passwordHide} alt="" />
            </Input>

            <Divider></Divider>
            <h6 className="popup-set-password__error-text error-text">
              Password mismatch and other error messages
            </h6>
            {/* <h6 className="">Password mismatch and other error messages</h6> */}
            <Divider></Divider>
          </div>

          <div className="popup-footer">
            <Button button="secondary">
              <span>Skip</span>
            </Button>
            <Button button="primary">
              <span>confirm</span>
            </Button>
          </div>
        </DialogueSetPasswordContent>
      </PopupContainer>
    </>
  );
};
