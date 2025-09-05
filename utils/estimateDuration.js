export function estimateRideDurationHours(fromPinCode, toPinCode) {
  const a = parseInt(fromPinCode, 10);
  const b = parseInt(toPinCode, 10);
  const diff = Math.abs(a - b);
  return diff % 24;
}
