import { z } from 'zod';
import { ILangState } from '..';

export const validateEmail = (email: string, lang: ILangState) => {
  const EmailSchema = z
    .string()
    .min(1, { message: lang.strings.validation.generic.required })
    .email({ message: lang.strings.validation.email.invalid });

  return EmailSchema.safeParse(email);
};
export const validatePassword = (
  passwordObj: {
    password: string;
    confirm: string;
  },
  lang: ILangState,
) => {
  const PasswordSchema = z
    .object({
      password: z
        .string()
        .min(1, { message: lang.strings.validation.password.required }),
      confirm: z
        .string()
        .min(1, { message: lang.strings.validation.password.confirmRequired }),
    })
    .refine(data => data.password === data.confirm, {
      message: lang.strings.validation.password.mismatch,
      path: ['confirm'],
    });
  return PasswordSchema.safeParse(passwordObj);
};
