/**
 * Globals a snippet sees as undefined (each is a parameter of the wrapper), so
 * it can't read the server's environment (DATABASE_URL and the other secrets)
 * or reach the network: the database holds mom's check-ins and Only me items,
 * which no connector may read. Defense in depth, not a sandbox: a deliberate
 * escape (a host object's constructor chain, dynamic import) still gets out.
 */
export const SHADOWED_GLOBALS = [
  "process",
  "fetch",
  "require",
  "module",
  "exports",
  "globalThis",
  "global",
  "Buffer",
  "WebSocket",
  "XMLHttpRequest",
  "EventSource",
  "Function",
  "eval",
];
