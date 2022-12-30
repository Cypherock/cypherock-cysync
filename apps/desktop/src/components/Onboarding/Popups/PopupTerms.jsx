import { PopupTermsContent } from "../../styles/Onboarding/Popups/PopupTermsContent.styled";
import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { Button } from "../../styles/ReusableComponents/button.style";
import { SquareCheckBox } from "../../styles/ReusableComponents/Checkbox/SquareCheckBox.styled";
import { useState } from "react";

export const PopupTerms = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <PopupContainer>
      <PopupTermsContent>
        <div className="popup-body">
          <h5 className="popup-heading">Terms of use</h5>
          <h6 className="popup-subheading">
            Please take some time to review our Terms or Service and Privacy
            Policy
          </h6>
          <div className="popup-terms_input">
            <div></div>
            <h7 className="popup-input-heading">Terms of service</h7>
          </div>
          <div className="popup-terms_input">
            <div></div>
            <h7 className="popup-input-heading">Privacy Policy</h7>
          </div>

          <div className="popup-terms_footer">
            <SquareCheckBox>
              <div>
                <input
                  type="checkbox"
                  onClick={() => setIsChecked((wasCheched) => !wasCheched)}
                />
              </div>
            </SquareCheckBox>
            <h7 className="popup-subheading popup-terms_footer-subheading ">
              I have read and agree with the Terms of Use and Privacy Policy
            </h7>
          </div>
        </div>

        <div className="popup-footer">
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
      </PopupTermsContent>
    </PopupContainer>
  );
};
