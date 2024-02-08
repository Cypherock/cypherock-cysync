import BigNumber from 'bignumber.js';

const validNumberRegex = /^\d*\.?\d*$/;

export type ProcessNonNegativeNumericInputParams = {
  input: string;
  isInteger?: boolean;
  isBigNumber?: boolean;
  maximum?: string;
};

export type ProcessNonNegativeNumericInputResult =
  | {
      numericValue: string;
      inputValue: string;
      isValid: true;
    }
  | {
      isValid: false;
    };

export type ProcessNonNegativeNumericInputFunction = (
  params: ProcessNonNegativeNumericInputParams,
) => ProcessNonNegativeNumericInputResult;

export const processNonNegativeNumericInput: ProcessNonNegativeNumericInputFunction =
  ({
    input,
    isInteger = false,
    isBigNumber = false,
    maximum = isBigNumber ? undefined : Number.MAX_SAFE_INTEGER.toString(10),
  }) => {
    if (input === '') {
      return {
        isValid: true,
        numericValue: '0',
        inputValue: '',
      };
    }

    const isValidInput = validNumberRegex.test(input);

    if (!isValidInput) return { isValid: false };

    if (isInteger && input.includes('.')) return { isValid: false };

    let finalInput = input;

    // prepend zero if value starts with decimal
    if (finalInput.startsWith('.')) {
      finalInput = `0${finalInput}`;
    }

    const numericValueBN = new BigNumber(finalInput);

    if (numericValueBN.isNaN()) return { isValid: false };
    if (maximum && numericValueBN.isGreaterThan(maximum))
      return { isValid: false };

    // avoid insignificant zero from start
    while (
      finalInput.startsWith('00') ||
      (finalInput.startsWith('0') && isInteger) ||
      (finalInput.startsWith('0') &&
        finalInput.includes('.') &&
        !finalInput.startsWith('0.'))
    ) {
      finalInput = finalInput.slice(1);
    }

    return {
      isValid: true,
      inputValue: finalInput,
      numericValue: numericValueBN.toString(),
    };
  };
