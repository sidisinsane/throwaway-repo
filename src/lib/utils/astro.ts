import type { CollectionEntry } from "astro:content";
import { getEntry } from "astro:content";

const DEFAULT_LOCALE = "en-US" as keyof typeof Intl.Locale;

export type CollectionType =
  | CollectionEntry<"snippets">
  | CollectionEntry<"authors">
  | CollectionEntry<"udhr">;

export interface CollectionPaginationProps {
  entry: CollectionEntry<"snippets"> | CollectionEntry<"udhr">;
  index: number;
  total: number;
  prev: any | null;
  next: any | null;
}

/**
 * Retrieves the author's name from their slug.
 *
 * @param {string} authorSlug - The slug of the author.
 * @returns {Promise<string>} The author's name.
 *
 * @example
 * const authorSlug = "john-doe";
 * const authorName = await getAuthorNameFromAuthorSlug(authorSlug);
 * console.log(authorName); // "John Doe"
 */
export async function getAuthorNameFromAuthorSlug(authorSlug: string) {
  const entry = (await getEntry(
    "authors",
    authorSlug,
  )) as CollectionEntry<"authors">;
  const name = await getAuthorNameFromCollection(entry);

  return name;
}

/**
 * Retrieves the title from a collection entry.
 *
 * @param {CollectionType} entry - The collection entry.
 * @param {keyof typeof Intl.Locale} [defaultLocale=DEFAULT_LOCALE] - The default locale for formatting.
 * @returns {Promise<string>} The title of the collection entry.
 *
 * @example
 * const collectionEntry = {
 *   collection: "snippets",
 *   data: {
 *     title: "Sample Snippet",
 *   },
 * };
 * const title = await getTitleFromCollection(collectionEntry);
 * console.log(title); // "Sample Snippet"
 */
export async function getTitleFromCollection(
  entry: CollectionType,
  defaultLocale: keyof typeof Intl.Locale = DEFAULT_LOCALE,
) {
  if (entry.collection == "udhr") {
    const locale = (entry.data.locale ||
      defaultLocale) as keyof typeof Intl.Locale;

    return `${getExonym(locale)} | ${getEndonym(locale)}`;
  }

  if (entry.collection == "authors") {
    const name = await getAuthorNameFromCollection(entry);
    return name;
  }

  return entry.data.title;
}

/**
 * Retrieves the author's name from a collection entry.
 *
 * @param {CollectionEntry<"authors">} entry - The collection entry containing author data.
 * @returns {string} The author's name or alias.
 *
 * @example
 * const authorEntry = {
 *   collection: "authors",
 *   data: {
 *     name: "John Doe",
 *     alias: "johndoe",
 *   },
 * };
 *
 * const authorName = getAuthorNameFromCollection(authorEntry);
 * console.log(authorName); // "John Doe"
 */
export function getAuthorNameFromCollection(entry: CollectionEntry<"authors">) {
  return entry.data?.name || `@${entry.data.alias}`;
}

/**
 * Retrieves the endonym (local name) of a language based on the provided locale.
 *
 * @param {keyof typeof Intl.Locale} locale - The locale for which to retrieve the endonym.
 * @returns {string} The endonym (local name) of the language.
 *
 * @example
 * const endonym = getEndonym("fr");
 * console.log(endonym); // "français"
 */
function getEndonym(locale: keyof typeof Intl.Locale) {
  const intlObj = new Intl.DisplayNames([locale], { type: "language" });

  return intlObj.of(locale);
}

/**
 * Retrieves the exonym (name in a default locale) of a language based on the provided locale.
 *
 * @param {keyof typeof Intl.Locale} locale - The locale for which to retrieve the exonym.
 * @param {keyof typeof Intl.Locale} [defaultLocale=DEFAULT_LOCALE] - The default locale for formatting.
 * @returns {string} The exonym (name in a default locale) of the language.
 *
 * @example
 * const exonym = getExonym("fr", "en");
 * console.log(exonym); // "French"
 */
function getExonym(
  locale: keyof typeof Intl.Locale,
  defaultLocale: keyof typeof Intl.Locale = DEFAULT_LOCALE,
) {
  const intlObj = new Intl.DisplayNames([defaultLocale], {
    type: "language",
  });

  return intlObj.of(locale);
}
