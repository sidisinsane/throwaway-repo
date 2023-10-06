import { slugify } from "./slugify.ts";

/**
 * Compares two names and returns a sorting order based on their lexicographical order.
 *
 * @param name_a The first name.
 * @param name_b The second name.
 * @returns A negative value if name_a comes before name_b, a positive value if name_a comes after name_b,
 * and 0 if the names are equal.
 *
 * @example
 * const nameArray = ['Alice', 'Bob', 'Charlie', 'Eve'];
 * const sortedNames = nameArray.sort(sortByName);
 * console.log(sortedNames); // Output: ['Alice', 'Bob', 'Charlie', 'Eve']
 */
export function sortByName(name_a: string, name_b: string): number {
  if (name_a < name_b) {
    return -1;
  }

  if (name_a > name_b) {
    return 1;
  }

  return 0;
}

/**
 * Compares two date strings and returns a sorting order based on their chronological order.
 *
 * @param datestring_a The first date string.
 * @param datestring_b The second date string.
 * @returns A negative value if datestring_a is earlier than datestring_b,
 * a positive value if datestring_a is later than datestring_b,
 * and 0 if the date strings represent the same date and time.
 *
 * @example
 * const dateArray = ['2022-05-15', '2021-12-31', '2023-03-20'];
 * const sortedDates = dateArray.sort(sortByDatestring);
 * console.log(sortedDates); // Output: ['2021-12-31', '2022-05-15', '2023-03-20']
 */
export function sortByDatestring(
  datestring_a: string,
  datestring_b: string,
): number {
  return Date.parse(datestring_a) - Date.parse(datestring_b);
}

/**
 * Sorts an array of objects by their publication dates in descending order.
 *
 * @param {Object} a - The first object to compare.
 * @param {Object} b - The second object to compare.
 * @param {string | number | Date} a.data.pubDate - The publication date of the first object.
 * @param {string | number | Date} b.data.pubDate - The publication date of the second object.
 * @returns {number} A negative value if `a` comes before `b`, a positive value if `a` comes after `b`,
 * or zero if they have the same publication date.
 *
 * @example
 * const articles = [
 *   { data: { pubDate: '2023-06-15' } },
 *   { data: { pubDate: '2023-06-10' } },
 *   { data: { pubDate: '2023-06-20' } },
 * ];
 *
 * articles.sort(sortByPubDate);
 * // Result:
 * // [
 * //   { data: { pubDate: '2023-06-20' } },
 * //   { data: { pubDate: '2023-06-15' } },
 * //   { data: { pubDate: '2023-06-10' } },
 * // ]
 */
export function sortByPubDate(
  a: { data: { pubDate: string | number | Date } },
  b: { data: { pubDate: string | number | Date } },
) {
  const dateA: any = new Date(a.data.pubDate);
  const dateB: any = new Date(b.data.pubDate);

  return dateB - dateA;
}

/**
 * Sorts an array of objects by their titles converted to slugs in lexicographical order.
 *
 * @param {Object} a - The first object to compare.
 * @param {Object} b - The second object to compare.
 * @param {string} a.data.title - The title of the first object.
 * @param {string} b.data.title - The title of the second object.
 * @returns {number} A negative value if `a` comes before `b`, a positive value if `a` comes after `b`,
 * or zero if they have the same slug (title).
 *
 * @example
 * const articles = [
 *   { data: { title: 'Article Z' } },
 *   { data: { title: 'Article A' } },
 *   { data: { title: 'Article B' } },
 * ];
 *
 * articles.sort(sortBySlug);
 * // Result:
 * // [
 * //   { data: { title: 'Article A' } },
 * //   { data: { title: 'Article B' } },
 * //   { data: { title: 'Article Z' } },
 * // ]
 */
export function sortBySlug(
  a: { data: { title: string } },
  b: { data: { title: string } },
) {
  const slugA = slugify(a.data.title);
  const slugB = slugify(b.data.title);

  if (slugA < slugB) {
    return -1;
  }

  if (slugA > slugB) {
    return 1;
  }

  return 0;
}

/**
 * Sorts an array of objects by their aliases converted to slugs in lexicographical order.
 *
 * @param {Object} a - The first object to compare.
 * @param {Object} b - The second object to compare.
 * @param {string} a.data.alias - The alias of the first object.
 * @param {string} b.data.alias - The alias of the second object.
 * @returns {number} A negative value if `a` comes before `b`, a positive value if `a` comes after `b`,
 * or zero if they have the same slug (alias).
 *
 * @example
 * const users = [
 *   { data: { alias: 'user-z' } },
 *   { data: { alias: 'user-a' } },
 *   { data: { alias: 'user-b' } },
 * ];
 *
 * users.sort(sortByAlias);
 * // Result:
 * // [
 * //   { data: { alias: 'user-a' } },
 * //   { data: { alias: 'user-b' } },
 * //   { data: { alias: 'user-z' } },
 * // ]
 */
export function sortByAlias(
  a: { data: { alias: string } },
  b: { data: { alias: string } },
) {
  const aliasA = slugify(a.data.alias);
  const aliasB = slugify(b.data.alias);

  if (aliasA < aliasB) {
    return -1;
  }

  if (aliasA > aliasB) {
    return 1;
  }

  return 0;
}
