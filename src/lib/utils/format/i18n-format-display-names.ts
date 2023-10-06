/**
 * Represents the arguments for formatting a currency display name with internationalization.
 */
export interface I18nFormatDisplayNamesArgs {
  /**
   * The locale to use for formatting the display name. Defaults to "en-US".
   */
  locale?: keyof typeof Intl.Locale;
  /**
   * The currency code for which to retrieve the display name.
   */
  code: string;
}

/**
 * Formats a currency display name with internationalization.
 * @param args The arguments for formatting the currency display name.
 * @returns The formatted currency display name.
 *
 * @example
 * const formattedCurrencyName = i18nFormatCurrencyName({
 *   locale: "en-US",
 *   code: "USD"
 * });
 * console.log(formattedCurrencyName); // Output: "US Dollar"
 */
export function i18nFormatCurrencyName(
  args: I18nFormatDisplayNamesArgs,
): string {
  const { locale = "en-US", code } = args;

  const formatOptions: Intl.DisplayNamesOptions = {
    type: "currency",
    fallback: "code",
  };

  try {
    return new Intl.DisplayNames(locale, formatOptions).of(code) as string;
  } catch (error) {
    if (error instanceof RangeError) {
      console.error(`RangeError: ${error}`);
    }

    console.error(error);
    return code;
  }
}

/**
 * Formats a language display name with internationalization.
 * @param args The arguments for formatting the language display name.
 * @returns The formatted language display name.
 *
 * @example
 * const formattedLanguageName = i18nFormatLanguageName({
 *   locale: "en-US",
 *   code: "en"
 * });
 * console.log(formattedLanguageName); // Output: "English"
 */
export function i18nFormatLanguageName(
  args: I18nFormatDisplayNamesArgs,
): string {
  const { locale = "en-US", code } = args;

  const formatOptions: Intl.DisplayNamesOptions = {
    type: "language",
    fallback: "code",
  };

  try {
    return new Intl.DisplayNames(locale, formatOptions).of(code) as string;
  } catch (error) {
    if (error instanceof RangeError) {
      console.error(`RangeError: ${error}`);
    }

    console.error(error);
    return code;
  }
}

/**
 * Formats a region display name with internationalization.
 * @param args The arguments for formatting the region display name.
 * @returns The formatted region display name.
 *
 * @example
 * const formattedRegionName = i18nFormatRegionName({
 *   locale: "en-US",
 *   code: "US"
 * });
 * console.log(formattedRegionName); // Output: "United States"
 */
export function i18nFormatRegionName(args: I18nFormatDisplayNamesArgs): string {
  const { locale = "en-US", code } = args;

  const formatOptions: Intl.DisplayNamesOptions = {
    type: "region",
    fallback: "code",
  };

  try {
    return new Intl.DisplayNames(locale, formatOptions).of(code) as string;
  } catch (error) {
    if (error instanceof RangeError) {
      console.error(`RangeError: ${error}`);
    }

    console.error(error);
    return code;
  }
}

/**
 * Formats a script display name with internationalization.
 * @param args The arguments for formatting the script display name.
 * @returns The formatted script display name.
 *
 * @example
 * const formattedScriptName = i18nFormatScriptName({
 *   locale: "en-US",
 *   code: "Latn"
 * });
 * console.log(formattedScriptName); // Output: "Latin"
 */
export function i18nFormatScriptName(args: I18nFormatDisplayNamesArgs): string {
  const { locale = "en-US", code } = args;

  const formatOptions: Intl.DisplayNamesOptions = {
    type: "script",
    fallback: "code",
  };

  try {
    return new Intl.DisplayNames(locale, formatOptions).of(code) as string;
  } catch (error) {
    if (error instanceof RangeError) {
      console.error(`RangeError: ${error}`);
    }

    console.error(error);
    return code;
  }
}
