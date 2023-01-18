import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  DialogueBoxFooter,
  Button,
  HeadingSix,
} from "@/cysync-ui";
import serverError from "@/assets/images/Onboarding/deviceAuth/server-off.png";
import failed from "@/assets/images/Onboarding/deviceAuth/fail.png";
import setting from "@/assets/images/Onboarding/deviceAuth/settings-wrong.png";

export const DeviceAuthTestFailedServerError = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={serverError} mbFive />
          <HeadingFive textHeading>
            Device Authentication has failed
          </HeadingFive>

          <HeadingSix textMuted>
            Server data missing: There seems to be a server error. Retry by
            reconnecting the device first
          </HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button variation="Secondary" disabled={true}>
            Contact
          </Button>
          <Button variation="Primary">Retry</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};

export const DeviceAuthTestFailedFrameWareError = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={failed} mbFive />
          <HeadingFive textHeading>
            Device Authentication has failed
          </HeadingFive>

          <HeadingSix textMuted>
            There seems to be error with the ATECC firmware. Contact Cypherock
            support immmediately
          </HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button variation="Primary">Contact Support</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};

export const DeviceAuthTestFailedServerDown = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={failed} mbFive />

          <HeadingFive textHeading>
            Device authentication has failed
          </HeadingFive>

          <HeadingSix textMuted>
            The server seems to be down try connecting again after some time
          </HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button variation="Primary">Retry</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};

export const DeviceAuthTestFailedDeviceMisconfigured = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={setting} mbFive />

          <HeadingFive textHeading>
            Device authentication has failed
          </HeadingFive>

          <HeadingSix textMuted>
            Device seems to be misconfigured. Contact Cypherock support
            immediately
          </HeadingSix>
        </DialogueBoxBody>

        <DialogueBoxFooter>
          <Button variation="Primary">Contact Support</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
