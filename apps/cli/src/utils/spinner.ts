import type { Ora } from 'ora';

let oraPkg: typeof import('ora').default | undefined;

export const getOra = async () => {
  if (oraPkg) return oraPkg;

  // eslint-disable-next-line no-eval
  const oraBase = await (eval('import("ora")') as Promise<
    typeof import('ora')
  >);

  oraPkg = oraBase.default;

  return oraPkg;
};

export class Spinner {
  private readonly spinner: Ora;

  private _isCompleted: boolean;

  private constructor(spinner: Ora) {
    this.spinner = spinner;
    this._isCompleted = false;
  }

  static async create(text: string) {
    const ora = await getOra();
    const spinner = ora(text).start();

    return new Spinner(spinner);
  }

  get isCompleted() {
    return this._isCompleted;
  }

  succeed(text?: string) {
    this.spinner.succeed(text);
    this._isCompleted = true;
  }

  fail(text?: string) {
    this.spinner.fail(text);
    this._isCompleted = true;
  }

  updateText(text: string) {
    this.spinner.text = text;
    this.spinner.render();
  }
}
