/**
 * Auth helper functions for validating credentials on the client.
 */

/**
 * Validates an email address using a pragmatic RFC 5322-ish pattern.
 * Rejects empty/whitespace-only input and strings without a valid
 * local-part@domain.tld shape.
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== "string") {
    return false;
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return false;
  }

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_PATTERN.test(trimmed);
}

/**
 * Validates a password against minimum strength requirements:
 * at least 8 characters, containing at least one letter and one number.
 */
export function validatePassword(password: string): boolean {
  if (typeof password !== "string") {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasLetter && hasNumber;
}
