import { useState } from "react";

// The onboarding react components are stored in an array and the index of the array is used to navigate between the components.
// useSteps is a custom hook that returns the current step, the next step and the previous step.
interface steps {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useSteps = (): steps  => {
  const [step, setStep] = useState(0);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return {
    step,
    setStep,
    nextStep,
    prevStep,
  };
};
