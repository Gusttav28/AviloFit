export function formatNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatMacro(value: number, unit: "" | "g", locale = "en-US") {
  return `${formatNumber(value, locale)}${unit}`;
}

export function formatCalories(value: number, locale = "en-US") {
  return `${formatNumber(value, locale)} kcal`;
}

export function formatTargetPair(consumed: number, target: number, unit: "" | "g", locale = "en-US") {
  return `${formatMacro(consumed, unit, locale)} of ${formatMacro(target, unit, locale)}`;
}

export function clampProgress(consumed: number, target: number) {
  if (!Number.isFinite(consumed) || !Number.isFinite(target) || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((consumed / target) * 100)));
}
