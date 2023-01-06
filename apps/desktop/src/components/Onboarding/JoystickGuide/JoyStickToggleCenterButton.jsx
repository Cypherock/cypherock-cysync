import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFour,
  HeadingFive,
  HeadingSix,
  HeadingSmallest,
} from "../../styles/atoms/Headings/Heading.styled";
import centerButton from "./centerButton.png";
import centerButtonSuccess from "./centerButtonSuccess.png";
import { Image } from "../../styles/atoms/Image/Image.style";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";

export const JoyStickToggleCenterButton = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFour textHeading mbSeven>
            Center click the joystick to proceed
          </HeadingFour>

          {/* <Image src={centerButton} mbSeven /> */}
          <Image src={centerButtonSuccess} mbSeven />

          <HeadingFive textHeading mbOne>
            X1 Vault has a center button to perform click
          </HeadingFive>

          <HeadingSix textMuted>
            Follow the instruction on the device
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};

// export const JoyStickToggleCenterButtonSuccess = () => {
//   return (
//     <>
//       <DialogueBoxContainer>
//         <DialogueBoxBody>
//           <HeadingFour textHeading mbSeven>
//             Middle click the joystick to proceed
//           </HeadingFour>

//           <Image src={centerButtonSuccess} mbSeven />

//           <HeadingFive textHeading mbOne>
//             X1 Wallet has a center button to perform click
//           </HeadingFive>

//           <HeadingSix textMuted>
//             Follow the instruction on the X1 device
//           </HeadingSix>
//         </DialogueBoxBody>
//       </DialogueBoxContainer>
//     </>
//   );
// };
