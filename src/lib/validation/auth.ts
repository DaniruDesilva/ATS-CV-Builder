import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password cannot exceed 100 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(60, 'Full name cannot exceed 60 characters')
      .regex(/^[a-zA-Z\s'.-]+$/, 'Name can only contain letters, spaces, and hyphens'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Sanitizes redirect URLs to prevent open-redirect phishing attacks (CWE-601).
 * Strictly allows internal relative URLs (e.g. /dashboard, /builder).
 */
export function sanitizeRedirect(
  url: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Must begin with a single slash, no double slashes, no backslashes, no scheme
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.startsWith('/\\') &&
    !trimmed.includes('\\') &&
    !trimmed.toLowerCase().startsWith('/api') // Disallow redirecting directly into backend APIs
  ) {
    return trimmed;
  }

  return fallback;
}
