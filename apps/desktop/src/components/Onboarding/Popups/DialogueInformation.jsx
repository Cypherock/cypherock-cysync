import { DefaultDialogueContainer } from "../../styles/ReusableComponents/DefaultDialogueContainer.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/ReusableComponents/Heading.styled";
export const DialogueInformation = () => {
  return (
    <>
      <DefaultDialogueContainer>
        <div className="default-dialogue__body">
          <HeadingFive textHeading center mbFive>
            Ensure the following before you continue
          </HeadingFive>
          <ul className="default-dialogue__list">
            <li className="default-dialogue__list-items">
              <div></div>
              <HeadingSix textMuted mbTwo>
                You are present in a safe and secure environment
              </HeadingSix>
            </li>
            <li className="default-dialogue__list-items">
              <div></div>
              <HeadingSix textMuted mbTwo>
                You have atleast 15-30 minutes to setup your wallet
              </HeadingSix>
            </li>
            <li className="default-dialogue__list-items">
              <div></div>
              <HeadingSix textMuted mbTwo>
                You have an active internet connection
              </HeadingSix>
            </li>
            <li className="default-dialogue__list-items">
              <div></div>
              <HeadingSix textMuted mbTwo>
                The tamper-proof seal of the package is intact
              </HeadingSix>
            </li>
          </ul>
        </div>
      </DefaultDialogueContainer>
    </>
  );
};
