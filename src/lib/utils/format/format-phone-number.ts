import parsePhoneNumber from "libphonenumber-js";

/**
 * The available formatting properties for formatting a phone number.
 */
type FormatPhoneNumberProperty = "NATIONAL" | "INTERNATIONAL" | "RFC3966";

/**
 * Represents the arguments for formatting a phone number.
 */
export interface FormatPhoneNumberArgs {
  /**
   * The phone number to format.
   */
  number: string;
  /**
   * The desired formatting property. Defaults to 'INTERNATIONAL'.
   */
  property?: FormatPhoneNumberProperty;
}

/**
 * Formats a phone number using the libphonenumber-js library.
 * @param args The arguments for formatting the phone number.
 * @returns The formatted phone number string.
 *
 * @example
 * const formattedNumber = formatPhoneNumber({
 *   number: '+1234567890',
 *   property: 'NATIONAL'
 * });
 * console.log(formattedNumber); // Output: "(123) 456-7890"
 */
export function formatPhoneNumber(args: FormatPhoneNumberArgs): string {
  const { number, property = "INTERNATIONAL" } = args;
  const phoneNumber = parsePhoneNumber(number);

  if (!phoneNumber || !phoneNumber.isValid()) {
    return number;
  }

  return phoneNumber.format(property);
}
