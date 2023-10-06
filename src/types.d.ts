// @filename: src/types.d.ts

/**
 * Represents the arguments for formatting a date with internationalization.
 */
export type I18nFormatDateType = {
  /**
   * The string representation of the date to be formatted.
   */
  dateString?: string;
  /**
   * The locale to use for formatting the date. Defaults to "en-US".
   */
  locale?: keyof typeof Intl.Locale;
  /**
   * The options for formatting the date. If not provided, default options will be used.
   */
  formatOptions?: Intl.DateTimeFormatOptions;
};

/**
 * Represents the arguments for formatting a currency display name with internationalization.
 */
export type I18nFormatDisplayNamesType = {
  /**
   * The currency-, language-, region-/country- or script-code for which to retrieve the display name.
   */
  code: string;
  /**
   * The locale to use for formatting the display name. Defaults to "en-US".
   */
  locale?: keyof typeof Intl.Locale;
};

/**
 * The available formatting properties for formatting a phone number.
 */
export type FormatPhoneNumberProperty =
  | "NATIONAL"
  | "INTERNATIONAL"
  | "RFC3966";

/**
 * Represents the arguments for formatting a phone number.
 */
export type FormatPhoneNumberType = {
  /**
   * The phone number to format.
   */
  number: string;
  /**
   * The desired formatting property. Defaults to 'INTERNATIONAL'.
   */
  property?: FormatPhoneNumberProperty;
};
