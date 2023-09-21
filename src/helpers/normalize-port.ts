/**
 * Normalize a port into a number, string, or false.
 */
export function normalizePort(val: string): number | undefined {
  const port = parseInt(val, 10);

  if (isNaN(port)) return;
  if (port >= 0) return port;

  return;
}
