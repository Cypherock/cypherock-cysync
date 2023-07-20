import checkbox from '@inquirer/checkbox';
import input from '@inquirer/input';
import select from '@inquirer/select';

export interface ISelection {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export const querySelect = async (
  selections: ISelection[],
  message = 'Select your option',
) =>
  select({
    message,
    choices: selections,
  });

export const queryInput = async (message: string) => input({ message });

export const queryCheckbox = async (
  selections: ISelection[],
  message = 'Choose your options',
) =>
  checkbox({
    message,
    choices: selections,
  });
