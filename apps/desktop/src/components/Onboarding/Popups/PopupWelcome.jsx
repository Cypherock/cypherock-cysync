import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { PopupWelcomeContent } from "../../styles/Onboarding/Popups/PopupWelcomeContent.style";
import { WelcomePopupList } from "./WelcomePopupList";
import { Button } from "../../styles/ReusableComponents/button.style";

export const PopupWelcome = () => {
  return (
    <>
      <PopupContainer>
        <PopupWelcomeContent>
          <h5 className="popup-heading">
            Ensure the product contains the following
          </h5>
          <h6 className="popup-subheading">
            Make sure the tamper-proof seal of the package was intact
          </h6>
          <WelcomePopupList />
          <h6 className="popup-welcome-content__footer-text">
            Please email at <span>support@cypherock.com</span> if your package
            doesn't have any of these
          </h6>
          <Button button="primary">
            <span>Get Started</span>
          </Button>
        </PopupWelcomeContent>
      </PopupContainer>
    </>
  );
};
