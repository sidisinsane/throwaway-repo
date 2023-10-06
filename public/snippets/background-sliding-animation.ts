/**
 * Background Sliding Animation on Hover
 *
 * @param {HTMLElement} link
 * @param {HTMLElement} parent
 *
 * @example
 * <link href="/snippets/background-sliding-animation.css" rel="stylesheet" />
 * <script type="module" defer>
 *   import { slidingAreaHover } from "snippets/background-sliding-animation.ts";
 *
 *   const parents = document.querySelectorAll(".background-sliding-animation");
 *   parents.forEach((parent) => {
 *     const links = parent.querySelectorAll(".background-sliding-animation__link");
 *     links.forEach((link) => {
 *       link.addEventListener("mouseover", function () {
 *         backgroundSlidingAnimation(link, parent);
 *       });
 *     });
 *   });
 * </script>
 *
 * @see https://danilowoz.com/
 */
export function backgroundSlidingAnimation(
  link: HTMLElement,
  parent: HTMLElement,
) {
  const width = link.offsetWidth;
  const height = link.offsetHeight;
  const x = link.offsetLeft;
  const y = link.offsetTop;

  parent?.style.setProperty("--width", `${width}px`);
  parent?.style.setProperty("--height", `${height}px`);
  parent?.style.setProperty("--x", `${x}px`);
  parent?.style.setProperty("--y", `${y}px`);
}
