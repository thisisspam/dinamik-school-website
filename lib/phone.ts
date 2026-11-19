export function normalizePhoneNumber(value: string): string {
  const trimmedValue = value.trim();
  const extensionRange = trimmedValue.match(/^(.*?)(\d{2})\s*-\s*(\d{2})$/);
  const callableValue = extensionRange
    ? `${extensionRange[1]}${extensionRange[3]}`
    : trimmedValue;
  const digits = callableValue.replace(/\D/g, "");

  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `9${digits}`;
  return `90${digits}`;
}

export function createPhoneHref(value: string): string {
  return `tel:+${normalizePhoneNumber(value)}`;
}
