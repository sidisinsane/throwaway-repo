/**
 * Represents the arguments for formatting a date with internationalization.
 */
export interface I18nFormatDateProps {
  /**
   * The locale to use for formatting the date. Defaults to "en-US".
   */
  locale?: keyof typeof Intl.Locale;
  /**
   * The string representation of the date to be formatted.
   */
  dateString?: string;
  /**
   * The options for formatting the date. If not provided, default options will be used.
   */
  formatOptions?: Intl.DateTimeFormatOptions;
}

/**
 * Formats a date with internationalization.
 * @param props The arguments for formatting the date.
 * @returns The formatted date string.
 *
 * @example
 * const formattedDate = i18nFormatDate({
 *   locale: "en-US",
 *   dateString: "2023-06-10",
 *   formatOptions: { day: "numeric", month: "long", year: "numeric" }
 * });
 * console.log(formattedDate); // Output: "June 10, 2023"
 */
export function i18nFormatDate(props: I18nFormatDateProps): string {
  const defaultFormatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const {
    locale = "en-US",
    dateString = currDatestring(),
    formatOptions = defaultFormatOptions,
  } = props;

  const date = dateString ? new Date(dateString) : new Date();

  if (dateString && isNaN(date.getTime())) {
    console.error(`Invalid date: ${dateString}`);
    return dateString;
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

/**
 * Get the current date as a formatted string in the format "YYYY-MM-DD".
 *
 * @returns {string} The current date as a string.
 *
 * @example
 * const currentDate = currDatestring();
 * console.log(currentDate); // e.g., "2023-09-12"
 */
function currDatestring() {
  const date = new Date();
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const day = date.toLocaleString("default", { day: "2-digit" });

  return `${year}-${month}-${day}`;
}
