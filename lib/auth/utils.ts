// Simple stub so legacy imports resolve without crashing.
// You can extend this later to integrate real error handling.
export function setError(message: string) {
  // eslint-disable-next-line no-console
  console.error("[auth utils] ", message)
}
