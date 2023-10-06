/**
 * Removes the protocol (http:// or https://) from a URL.
 *
 * @param {string} url - The URL from which to remove the protocol.
 * @returns {string} The URL without the protocol.
 *
 * @example
 * const urlWithProtocol = "https://www.example.com";
 * const urlWithoutProtocol = removeUrlProtocol(urlWithProtocol);
 * console.log(urlWithoutProtocol); // "www.example.com"
 */
export function removeUrlProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
