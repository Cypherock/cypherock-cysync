import checkbox, { Choice } from '@inquirer/checkbox';
import input from '@inquirer/input';
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

export async function queryCheckbox<T>(
  selections: Selection<T>[],
  message = 'Choose your options',
) {
  return checkbox<T>({
    message,
    choices: selections,
  });
}
