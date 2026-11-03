/** Simple admin gate. Set ADMIN_PASSWORD in the environment; the admin UI sends it as a bearer token. */
export function isAdmin(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return process.env.NODE_ENV !== "production" || process.env.ALLOW_OPEN_ADMIN === "true";
  const header = req.headers.get("authorization") || "";
  return header === `Bearer ${pw}`;
}
export function adminRequiresPassword() {
  return Boolean(process.env.ADMIN_PASSWORD);
}
