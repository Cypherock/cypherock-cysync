/**
 * The card derived a different key than the account stores. With the right
 * wallet bound this means the card rebuilt another seed, which in practice is
 * a wrong passphrase. Check the `isX0KeyMismatchError` flag: the ES5 build
 * makes `instanceof` unreliable for Error subclasses.
 */
export class X0KeyMismatchError extends Error {
  public readonly isX0KeyMismatchError = true;

  constructor(
    message = 'X0 card derived a different key than the account stores',
  ) {
    super(message);
    this.name = 'X0KeyMismatchError';
  }
}
