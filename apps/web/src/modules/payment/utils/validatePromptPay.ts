export function isValidPromptPay(value: string): boolean {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return false;
  }

  return trimmed.length === 10 || trimmed.length === 13;
}

