// Text validation
export const validateNotEmpty = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} cannot be empty`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must be at most ${maxLength} characters`;
  }
  return null;
};

// JSON validation
export const validateJson = (value: string): string | null => {
  try {
    JSON.parse(value);
    return null;
  } catch (error) {
    return `Invalid JSON: ${(error as Error).message}`;
  }
};

// URL validation
export const validateUrl = (value: string): string | null => {
  try {
    new URL(value);
    return null;
  } catch {
    return "Invalid URL format";
  }
};

// Number validation
export const validateNumber = (value: string, fieldName: string): string | null => {
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  return null;
};

export const validateMinNumber = (value: number, min: number, fieldName: string): string | null => {
  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  return null;
};

export const validateMaxNumber = (value: number, max: number, fieldName: string): string | null => {
  if (value > max) {
    return `${fieldName} must be at most ${max}`;
  }
  return null;
};

// File validation
export const validateFileSize = (file: File, maxSizeInMB: number): string | null => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return `File size must be less than ${maxSizeInMB}MB`;
  }
  return null;
};

export const validateFileType = (file: File, allowedTypes: string[]): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  return null;
};

// Color validation
export const validateHexColor = (value: string): string | null => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(value)) {
    return "Invalid hex color format";
  }
  return null;
};

export const validateRgbColor = (r: number, g: number, b: number): string | null => {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return "RGB values must be between 0 and 255";
  }
  return null;
};

// Date validation
export const validateDate = (value: string): string | null => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Invalid date format";
  }
  return null;
};

export const validateDateRange = (startDate: Date, endDate: Date): string | null => {
  if (startDate > endDate) {
    return "Start date must be before end date";
  }
  return null;
};

// Email validation
export const validateEmail = (value: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Invalid email format";
  }
  return null;
};

// Password validation
export const validatePassword = (value: string): string | null => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  if (value.length < minLength) {
    return "Password must be at least 8 characters long";
  }
  if (!hasUpperCase) {
    return "Password must contain at least one uppercase letter";
  }
  if (!hasLowerCase) {
    return "Password must contain at least one lowercase letter";
  }
  if (!hasNumbers) {
    return "Password must contain at least one number";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character";
  }
  return null;
};

// IP Address validation
export const validateIpAddress = (value: string): string | null => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (!ipv4Regex.test(value) && !ipv6Regex.test(value)) {
    return "Invalid IP address format";
  }

  if (ipv4Regex.test(value)) {
    const parts = value.split('.');
    for (const part of parts) {
      const num = parseInt(part);
      if (num < 0 || num > 255) {
        return "Invalid IPv4 address range";
      }
    }
  }

  return null;
};

// Port number validation
export const validatePort = (value: number): string | null => {
  if (value < 1 || value > 65535) {
    return "Port number must be between 1 and 65535";
  }
  return null;
};

// Domain validation
export const validateDomain = (value: string): string | null => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(value)) {
    return "Invalid domain format";
  }
  return null;
};