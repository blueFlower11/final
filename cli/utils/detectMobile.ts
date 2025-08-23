export function isMobileUA(userAgent?: string) {
  const ua = (userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "")).toLowerCase();
  return /iphone|ipad|android|mobile/.test(ua);
}
