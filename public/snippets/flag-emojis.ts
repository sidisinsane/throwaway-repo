/** @type {NodeListOf<Element>} elements */
const elements = document.querySelectorAll("[data-cc]");

elements.forEach((element) => {
  const countryCode = element.getAttribute("data-cc");
  element.innerHTML = flagEmoji(countryCode);
  element.title = getCountryName(countryCode);
});

export function flagEmoji(countryCode) {
  return [...countryCode.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .reduce((a, b) => `${a}${b}`);
}

export function getCountryName(countryCode, locale = "en-US") {
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });
  return regionNames.of(countryCode);
}
