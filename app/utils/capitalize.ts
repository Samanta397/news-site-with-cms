export function capitalize(value?: string) {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
}
