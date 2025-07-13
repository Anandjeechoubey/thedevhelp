import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export const SignUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'], // path of error
});

export const SpendLogSchema = z.object({
  category: z.string().min(1, { message: 'Category is required.' }),
  note: z.string().optional(),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  date: z.string().min(1, { message: 'Date is required.' }),
  payment_method: z.string().min(1, { message: 'Payment method is required.' }),
});

// List of supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;

export const UserPreferencesSchema = z.object({
  currency: z.string().min(1, { message: 'Currency is required.' }),
  theme: z.enum(THEME_OPTIONS).default('system'),
});
