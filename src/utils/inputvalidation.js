import z from 'zod';

export const userInputValidateSignUp = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6)
})

export const userInputValidateLogin = z.object({
  email: z.email(),
  password:z.string().min(6)
});

export const financeInputValidator = z.object({
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  date: z.coerce.date(), 
  note: z.string(),
});