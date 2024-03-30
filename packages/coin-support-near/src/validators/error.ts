import { AxiosError } from 'axios';

export class ApiResponseValidationError extends AxiosError {
  public isApiResponseValidationError = true;

  constructor(message?: string) {
    super(message ?? 'Invalid response from server');
  }
}
