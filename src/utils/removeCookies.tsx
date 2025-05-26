/**
 * Removes all cookies for a specified domain.
 * @param domain - The domain for which to remove cookies.
 */
export const removeAllCookies = (domain: string) => {
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
  });
};