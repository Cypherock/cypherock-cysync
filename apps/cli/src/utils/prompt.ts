import checkbox, { Choice } from '@inquirer/checkbox';
import input from '@inquirer/input';
import { confirm } from '@inquirer/prompts';
import select from '@inquirer/select';
import colors from 'colors/safe';

export type Selection<T> = Choice<T>;

export async function querySelect<T>(
  selections: Selection<T>[],
  message = 'Select your option',
) {
  return select<T>({
    message,
    choices: selections,
  });
}

export const queryInput = async (message: string, defaultMessage?: string) =>
  input({ message, default: defaultMessage });

export const queryNumber = async (message: string) => {
  while (true) {
    const str = await input({ message });
    const num = parseInt(str, 10);

    if (!Number.isNaN(num)) {
      return num;
    }

    console.log(colors.yellow('Please enter a valid number'));
  }
};

export const queryConfirm = async (message: string) => confirm({ message });

export async function queryCheckbox<T>(
  selections: Selection<T>[],
  message = 'Choose your options',
) {
  return checkbox<T>({
    message,
    choices: selections,
  });
}
