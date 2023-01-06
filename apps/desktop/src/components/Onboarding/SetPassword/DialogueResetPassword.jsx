import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { DialogueSetPasswordContent } from "../../styles/Onboarding/Popups/DialogueSetPasswordContent.styled";
import { Input } from "../../styles/ReusableComponents/Input.styled";
import passwordHide from "./password-hide.png";
import { Divider } from "../../styles/ReusableComponents/Divider.styled";
import { Button } from "../../styles/ReusableComponents/button.style";

export const DialogueResetPassword = () => {
  return (
    <>
      <PopupContainer>
        <DialogueSetPasswordContent>
          <div className="popup-body">
            <h5 className="popup-heading">
              Resetting password will reset your cySync app data
            </h5>
            <h6 className="popup-subheading">
              Your funds will remain intact, and you will still be able to sync
              the data again through your X1 Vault
            </h6>
            <Input>
              <label>Enter Password</label>
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
              <span>Go Back</span>
            </Button>
            <Button button="primary">
              <span>Reset</span>
            </Button>
          </div>
        </DialogueSetPasswordContent>
      </PopupContainer>
    </>
  );
};
