import checkbox, { Choice } from '@inquirer/checkbox';
import input from '@inquirer/input';
import { confirm } from '@inquirer/prompts';
import select from '@inquirer/select';

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

export const queryInput = async (message: string) => input({ message });

export const queryNumber = async (message: string) => {
  const str = await input({ message });
  const num = parseInt(str, 10);

  if (Number.isNaN(num)) {
    throw new Error('Invalid number');
  }

  return num;
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
