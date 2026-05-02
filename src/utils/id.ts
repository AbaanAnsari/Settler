let counter = 0;

export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  counter += 1;
  return `${timestamp}-${rand}-${counter}`;
}
