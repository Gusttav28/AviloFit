export function formatNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatSigned(value: number, locale = "en-US") {
  const formatted = formatNumber(Math.abs(value), locale);
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatCalories(value: number, locale = "en-US") {
  return `${formatNumber(value, locale)} kcal`;
}

export function formatMacro(value: number, unit: string) {
  return `${value}${unit}`;
}
