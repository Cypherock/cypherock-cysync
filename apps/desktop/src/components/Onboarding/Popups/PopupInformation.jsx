import { PopupContainer } from "../../styles/ReusableComponents/PopupContainer.styled";
import { PopupInformationContent } from "../../styles/Onboarding/Popups/PopupInformationContent.style";

export const Information = () => {
  return (
    <>
      <PopupContainer>
        <PopupInformationContent>
          <h4 className="information-popup-content__heading">
            Ensure the following before you continue
          </h4>
          <ul className="information-popup-content__list">
            <li className="information-popup-content__list-items">
              <div></div>
              <h5>You are present in a safe and secure environment</h5>
            </li>
            <li className="information-popup-content__list-items">
              <div></div>
              <h5>You have atleast 15-30 minutes to setup your wallet</h5>
            </li>
            <li className="information-popup-content__list-items">
              <div></div>
              <h5>Make sure the tamper-proof seal of the package was intact</h5>
            </li>
          </ul>
        </PopupInformationContent>
      </PopupContainer>
    </>
  );
};
