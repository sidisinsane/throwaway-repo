/**
 * A map of diacritic characters to their corresponding replacements.
 */
const DIACRITICS_MAP: Record<string, string> = {
  À: "A",
  Ä: "Ae",
  Ç: "C",
  Ì: "I",
  Ñ: "N",
  Ö: "Oe",
  Ù: "O",
  Ü: "Ue",
  à: "a",
  ä: "ae",
  ç: "c",
  ì: "i",
  ñ: "n",
  ò: "o",
  ö: "oe",
  ù: "u",
  ü: "ue",
  Ď: "D",
  ď: "d",
  ē: "e",
  Ĕ: "E",
  Ĝ: "G",
  ĝ: "g",
  Ĥ: "H",
  ĥ: "h",
  Ĵ: "J",
  ĵ: "j",
  Ķ: "K",
  ķ: "k",
  Ļ: "L",
  ľ: "l",
  Ŕ: "R",
  ŕ: "r",
  Ś: "S",
  ŝ: "s",
  Ţ: "T",
  ţ: "t",
  Ũ: "U",
  Ŵ: "W",
  ŵ: "w",
  Ŷ: "Y",
  ŷ: "y",
  Ź: "Z",
  ź: "z",
};

/**
 * A map of ligature characters to their corresponding replacements.
 */
const LIGATURES_MAP: Record<string, string> = {
  æ: "ae",
  Æ: "Ae",
  œ: "oe",
  Œ: "Oe",
  ß: "ss",
  ﬀ: "ff",
  ﬁ: "fi",
  ﬂ: "fl",
  ﬃ: "ffi",
  ﬄ: "ffl",
  ﬅ: "ft",
  ﬆ: "st",
  ĳ: "ij",
  Ĳ: "Ij",
  ʒ: "ezh",
  Ʒ: "Ez",
};

/**
 * A map of diacritic and ligature characters to their corresponding replacements.
 */
const TRANSLITERATE_MAP = { ...DIACRITICS_MAP, ...LIGATURES_MAP };

/**
 * Transliterates the given text by replacing diacritic and ligature characters
 * with their corresponding replacements.
 *
 * @param {string} text - The text to transliterate.
 * @returns {string} - The transliterated text.
 */
function transliterate(text: string): string {
  for (const char in TRANSLITERATE_MAP) {
    if (Object.prototype.hasOwnProperty.call(TRANSLITERATE_MAP, char)) {
      text = text.replace(new RegExp(char, "g"), TRANSLITERATE_MAP[char]);
    }
  }

  text = text.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");

  return text;
}

/**
 * Generates a slug from the given string by converting it to a URL-friendly format.
 *
 * @param {string} str - The string to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(str: string): string {
  str = transliterate(str);
  str = str.toLowerCase().trim();
  str = str.replace(/[^\w\s-]/g, "");
  str = str.replace(/[\s_-]+/g, "-");
  str = str.replace(/^-+|-+$/g, "");

  return str;
}
