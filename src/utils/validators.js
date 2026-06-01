export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone) => /^\d{10}$/.test(phone);

export const validatePassword = (password) => String(password).length >= 6;

export const validateRequired = (value) => String(value ?? '').trim().length > 0;

