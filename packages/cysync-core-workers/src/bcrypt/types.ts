export interface CreateBcryptHashParams {
  value: string;
  salt: string | number;
}

export interface VerifyBcryptHashParams {
  value: string;
  hash: string;
}
