// eslint-disable-next-line import/order
import '../../config';

import { ManagerApp, OnboardingStep } from '@cypherock/sdk-app-manager';
import { DeviceState } from '@cypherock/sdk-interfaces';
import { Flags } from '@oclif/core';
import colors from 'colors/safe';

import {
  authAllCards,
  authDevice,
  trainCard,
  trainJoystick,
  updateFirmwareAndGetApp,
} from '~/services';
import { BaseCommand } from '~/utils';

export default class OnboardingSetup extends BaseCommand<
  typeof OnboardingSetup
> {
  static description = 'Onboard new device';

  static examples = [`$ <%= config.bin %> <%= command.id %>`];

  static flags = {
    step: Flags.integer({
      min: OnboardingStep.ONBOARDING_STEP_VIRGIN_DEVICE,
      max: OnboardingStep.ONBOARDING_STEP_CARD_CHECKUP,
      char: 's',
      description: 'Onboarding step to start from',
    }),
  };

  protected connectToDevice = true;

  // eslint-disable-next-line class-methods-use-this
  async runOnboardingSteps(app: ManagerApp, deviceStep: OnboardingStep) {
    let isPairRequired = false;

    const stepHandlers: Record<
      OnboardingStep,
      (() => Promise<void>) | undefined
    > = {
      [OnboardingStep.ONBOARDING_STEP_VIRGIN_DEVICE]: async () => {
        await authDevice(app);
      },
      [OnboardingStep.ONBOARDING_STEP_DEVICE_AUTH]: async () => {
        await trainJoystick(app);
      },
      [OnboardingStep.ONBOARDING_STEP_JOYSTICK_TRAINING]: async () => {
        const result = await trainCard(app);
        isPairRequired = !result.cardPaired;
      },
      [OnboardingStep.ONBOARDING_STEP_CARD_CHECKUP]: async () => {
        await authAllCards({ app, isPairRequired });
      },
      [OnboardingStep.UNRECOGNIZED]: undefined,
      [OnboardingStep.ONBOARDING_STEP_CARD_AUTHENTICATION]: undefined,
      [OnboardingStep.ONBOARDING_STEP_COMPLETE]: undefined,
    };

    let startingStep = deviceStep;

    // Start from card training when device is waiting for card auth
    if (startingStep === OnboardingStep.ONBOARDING_STEP_CARD_CHECKUP) {
      startingStep = OnboardingStep.ONBOARDING_STEP_JOYSTICK_TRAINING;
    }

    for (
      let step = startingStep;
      step < OnboardingStep.ONBOARDING_STEP_CARD_AUTHENTICATION;
      step += 1
    ) {
      const handler = stepHandlers[step];
      if (!handler) {
        return;
      }

      await handler();
    }
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(OnboardingSetup);

    this.log(colors.blue('Starting onboarding'));

    let app = await ManagerApp.create(this.connection);
    const deviceState = await this.connection.getDeviceState();

    if (deviceState === DeviceState.BOOTLOADER) {
      this.log(colors.yellow('Device is in bootloader mode, updating...'));
      app = await updateFirmwareAndGetApp(app);
    }

    if (!(await app.isSupported())) {
      this.log(colors.yellow('Device is not supported, updating...'));
      app = await updateFirmwareAndGetApp(app);
    }

    const deviceInfo = await app.getDeviceInfo();

    if (!deviceInfo.isInitial) {
      this.log(colors.green('Device is already onboarded'));
      return;
    }

    await this.runOnboardingSteps(app, flags.step ?? deviceInfo.onboardingStep);

    this.log(colors.green('Onboarding Completed'));
    await app.destroy();
  }
}
