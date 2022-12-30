import { useState } from "react";

export const WelcomePopupList = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div className="popup-welcome-content__info">
        <div className="popup-welcome-content__info-section">
          <div
            className={
              isActive
                ? "popup-welcome-content__info-list-item-active"
                : "popup-welcome-content__info-list-item-inactive"
            }
            onClick={() => setIsActive((wasActive) => !wasActive)}
          >
            <div className="popup-welcome-content__info-list-bullet"></div>
            <span className="popup-welcome-content__info-list-heading">
              X1 Wallet
            </span>
          </div>
          <div
            className={
              isActive
                ? "popup-welcome-content__info-list-item-active"
                : "popup-welcome-content__info-list-item-inactive"
            }
            onClick={() => setIsActive((wasActive) => !wasActive)}
          >
            <div className="popup-welcome-content__info-list-bullet"></div>
            <span className="popup-welcome-content__info-list-heading">
              USB Cable
            </span>
          </div>
        </div>
        <div className="popup-welcome-content__info-section">
          <div
            className={
              isActive
                ? "popup-welcome-content__info-list-item-active"
                : "popup-welcome-content__info-list-item-inactive"
            }
            onClick={() => setIsActive((wasActive) => !wasActive)}
          >
            <div className="popup-welcome-content__info-list-bullet"></div>
            <span className="popup-welcome-content__info-list-heading">
              4 X1 Cards
            </span>
          </div>
          <div
            className={
              isActive
                ? "popup-welcome-content__info-list-item-active"
                : "popup-welcome-content__info-list-item-inactive"
            }
            onClick={() => setIsActive((wasActive) => !wasActive)}
          >
            <div className="popup-welcome-content__info-list-bullet"></div>
            <span className="popup-welcome-content__info-list-heading">
              4 Card Covers
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
