export const GENERAL_WHATSAPP_MESSAGE = "Merhaba, Dinamik Okulları hakkında bilgi almak istiyorum.";

export function normalizeWhatsappNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `9${digits}`;
  return `90${digits}`;
}

export function createWhatsappHref(number: string, message = GENERAL_WHATSAPP_MESSAGE): string {
  const href = `https://wa.me/${normalizeWhatsappNumber(number)}`;
  const trimmedMessage = message.trim();
  return trimmedMessage ? `${href}?text=${encodeURIComponent(trimmedMessage)}` : href;
}
