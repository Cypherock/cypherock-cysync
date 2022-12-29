import { Container } from "../../styles/Container.styled";
import { PopupContainer } from "../../styles/PopupContainer.styled";
import { InformationPopupContent } from "../../styles/Onboarding/Information/InformationPopupContent.style";

export const Information = () => {
  return (
    <>
      <Container bg="SplashLoader">
        <PopupContainer>
          <InformationPopupContent>
            <h4 className="information-popup-content__heading">
              Ensure the following before you continue
            </h4>
            <ul className="information-popup-content__list">
              <li className="information-popup-content__list-items">
                <span></span>
                <h5>You are present in a safe and secure environment</h5>
              </li>
              <li className="information-popup-content__list-items">
                <span></span>
                <h5>You have atleast 15-30 minutes to setup your wallet</h5>
              </li>
              <li className="information-popup-content__list-items">
                <span></span>
                <h5>
                  Make sure the tamper-proof seal of the package was intact
                </h5>
              </li>
            </ul>
          </InformationPopupContent>
        </PopupContainer>
      </Container>
    </>
  );
};
