import { z } from 'zod';

import { ILangState } from '..';

export const validateEmail = (email: string, lang: ILangState) => {
  const EmailSchema = z
    .string()
    .min(1, { message: lang.strings.validation.generic.required })
    .email({ message: lang.strings.validation.email.invalid });

  return EmailSchema.safeParse(email);
};

const passwordPrefixed = (prefix: string, lang: ILangState) =>
  z
    .string()
    .min(1, { message: prefix + lang.strings.validation.password.required })
    .min(8, {
      message: prefix + lang.strings.validation.password.minLength,
    })
    .refine(
      val => /.*?[A-Z].*/.test(val),
      prefix + lang.strings.validation.password.containUppercase,
    )
    .refine(
      val => /.*?[a-z].*/.test(val),
      prefix + lang.strings.validation.password.containLowercase,
    )
    .refine(
      val => /.*?[0-9].*/.test(val),
      prefix + lang.strings.validation.password.containNumber,
    )
    .refine(
      val => /.*?[!@#$%^&*()_+=-].*/.test(val),
      prefix + lang.strings.validation.password.containSymbol,
    );

export const validatePassword = (
  passwordObj: {
    password: string;
    confirm: string;
  },
  lang: ILangState,
) => {
  const PasswordSchema = z
    .object({
      password: passwordPrefixed(
        lang.strings.validation.password.passwordFieldPrefix,
        lang,
      ),
      confirm: z.string(),
    })
    .refine(data => data.password === data.confirm, {
      message: lang.strings.validation.password.mismatch,
      path: ['confirm'],
    });
  return PasswordSchema.safeParse(passwordObj);
};
