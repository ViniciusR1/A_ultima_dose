export const normalizeDigits = (value) => value.replace(/\D/g, '');

export const isValidCPF = (cpf) => {
  const digits = normalizeDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  const calcCheck = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) {
      sum += Number(digits[i]) * ((len + 1) - i);
    }
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };
  return calcCheck(9) === Number(digits[9]) && calcCheck(10) === Number(digits[10]);
};

export const isValidCEP = (cep) => /^[0-9]{5}-?[0-9]{3}$/.test(normalizeDigits(cep));

export const formatCPF = (value) => {
  const digits = normalizeDigits(value);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const formatCEP = (value) => {
  const digits = normalizeDigits(value);
  if (digits.length === 0) return '';
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};
