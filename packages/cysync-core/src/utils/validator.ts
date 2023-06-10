import { z } from 'zod';

const EmailSchema = z
  .string()
  .min(1, { message: 'This field has to be filled.' })
  .email('This is not a valid email.');

const PasswordSchema = z
  .object({
    password: z.string().min(1, { message: 'Password is required' }),
    confirm: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine(data => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

export const validateEmail = (email: string) => EmailSchema.safeParse(email);
export const validatePassword = (passwordObj: {
  password: string;
  confirm: string;
}) => PasswordSchema.safeParse(passwordObj);
