import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxHeader,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";

export const DeviceAuthTestFailedServerError = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Device Authentication Failed
          </HeadingSix>
        </DialogueBoxHeader>

        <DialogueBoxBody>
          <HeadingFive textHeading>
            Server error: Server data missing
          </HeadingFive>

          <HeadingSix textMuted>
            Retry by reconnecting the device first
          </HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button secondary>Contact</Button>
          <Button primary>Retry</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};

export const DeviceAuthTestFailedFrameWareError = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Device Authentication Failed
          </HeadingSix>
        </DialogueBoxHeader>

        <DialogueBoxBody>
          <HeadingFive textHeading>ATECC firmware wrong</HeadingFive>

          <HeadingSix textMuted>Contact Cypherock immediately</HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button secondary>Contact Support</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};

export const DeviceAuthTestFailedServerDown = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Device Authentication Failed
          </HeadingSix>
        </DialogueBoxHeader>

        <DialogueBoxBody>
          <HeadingFive textHeading>Server down</HeadingFive>

          <HeadingSix textMuted>
            Try connecting again after some time
          </HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button primary>Retry</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};

export const DeviceAuthTestFailedDeviceMisconfigured = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Device Authentication Failed
          </HeadingSix>
        </DialogueBoxHeader>

        <DialogueBoxBody>
          <HeadingFive textHeading>Device Misconfigured</HeadingFive>

          <HeadingSix textMuted>Contact Cypherock</HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button secondary>Contact</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
