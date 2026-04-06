/** Staff console JWT (localStorage). */
export const STAFF_TOKEN_KEY = "preluraStaffToken";
/** Consumer / marketplace JWT (localStorage). */
export const USER_TOKEN_KEY = "preluraUserToken";

/** Next.js route prefix for the staff app (must match `app/myprelura-admin`). */
export const STAFF_APP_PATH_PREFIX = "/myprelura-admin";

/**
 * `Authorization` header value for GraphQL / WS for the **current** browser URL.
 * Staff and consumer sessions are stored separately; we must not send the staff
 * JWT on marketplace routes (it would make `viewMe` etc. always resolve to the
 * staff account).
 */
export function graphqlBearerAuthorizationHeader(): string {
  if (typeof window === "undefined") return "";
  const path = window.location.pathname || "";
  const staffApp = path.startsWith(STAFF_APP_PATH_PREFIX);
  if (staffApp) {
    const staff = localStorage.getItem(STAFF_TOKEN_KEY);
    return staff ? `Bearer ${staff}` : "";
  }
  const user = localStorage.getItem(USER_TOKEN_KEY);
  return user ? `Bearer ${user}` : "";
}
