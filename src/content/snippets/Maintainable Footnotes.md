---
locale: de-DE
title: Maintainable Footnotes
description: Using CSS counters to automate the numbering of footnotes.
author: sitepoint
tags: ["css"]
isBasedOnUrl: https://codepen.io/SitePoint/pen/QbMgvY
codepenSlug: eYbLpNL
---

<link href="/snippets/maintainable-footnotes.css" rel="stylesheet" />

<article class="has-maintainable-footnotes demo">
  <p>
    Maintaining <a href="#maintainable-footnote-footnotes" aria-describedby="maintainable-footnotes-label" id="maintainable-footnote-footnotes-ref">footnotes</a> manually can be a pain. By using <a
      href="#maintainable-footnote-css-counters"
      aria-describedby="maintainable-footnotes-label"
      id="maintainable-footnote-css-counters-ref"
    ><abbr title="Cascading Style Sheets">CSS</abbr> counters</a> to add the numbered references in the text and an ordered list to display the
    actual footnotes in the footer, it becomes a bit easier.
  </p>

  <table>
    <caption>
      Recommended grid behavior for
      <a
        href="#maintainable-footnote-device-breakpoints"
        aria-describedby="maintainable-footnotes-label"
        id="maintainable-footnote-device-breakpoints-ref"
      >device breakpoints</a>
    </caption>
    <thead>
      <tr>
        <th>Screen size</th>
        <th>Margin</th>
        <th>Body</th>
        <th>Layout columns</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Extra-small (phone)</th>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>0-599<a
            href="#maintainable-footnote-dp"
            aria-describedby="maintainable-footnotes-label"
            id="maintainable-footnote-dp-ref"
          >dp</a></td>
        <td>
          16dp
        </td>
        <td>Fluid</td>
        <td>4</td>
      </tr>
      <tr>
        <th>Small (tablet)</th>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>600-904</td>
        <td>32dp</td>
        <td>Fluid</td>
        <td>8</td>
      </tr>
      <tr>
        <td>905-1239</td>
        <td>Fluid</td>
        <td>840dp</td>
        <td>12</td>
      </tr>
      <tr>
        <th>Medium (laptop)</th>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>1240-1439</td>
        <td>200dp</td>
        <td>Fluid</td>
        <td>12</td>
      </tr>
      <tr>
        <th>Large (desktop)</th>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>1440+</td>
        <td>Fluid</td>
        <td>1040</td>
        <td>12</td>
      </tr>
    </tbody>
  </table>

  <footer>
    <h4 id="maintainable-footnotes-label">
      References
    </h4>
    <ol class="maintainable-footnotes">
    <li id="maintainable-footnote-footnotes">Footnotes are notes placed at the bottom of a page. They cite references or comment on a designated part of the text above it. <a href="#maintainable-footnote-footnotes-ref" aria-label="Back to content"><svg class="maintainable-footnote__icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><use xlink:href="#chevrons-up"></use></svg></a></li>
<li id="maintainable-footnote-css-counters">CSS counters are, in essence, variables maintained by CSS whose values may be incremented by CSS rules to track how many times they're used. <a href="#maintainable-footnote-css-counters-ref" aria-label="Back to content"><svg class="maintainable-footnote__icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><use xlink:href="#chevrons-up"></use></svg></a></li>
      <li id="maintainable-footnote-device-breakpoints">
        <a href="https://m2.material.io/design/layout/understanding-layout.html#layout-anatomy">
          Understanding layout - Material Design</a>. <a
          href="#maintainable-footnote-device-breakpoints-ref"
          aria-label="Back to content"
        ><svg class="maintainable-footnote__icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><use xlink:href="#chevrons-up"></use></svg></a>
      </li>
      <li id="maintainable-footnote-dp">
        A dp is equal to one physical pixel on a screen with a density of
        160. To calculate dp: dp = (width in pixels * 160) / screen
        density. When designing for the web, replace dp with px (for
        pixel). Source:
        <a href="https://m2.material.io/design/layout/pixel-density.html#pixel-density">
          Pixel density - Material Design</a>. <a
          href="#maintainable-footnote-dp-ref"
          aria-label="Back to content"
        ><svg class="maintainable-footnote__icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><use xlink:href="#chevrons-up"></use></svg></a>
      </li>
    </ol>
  </footer>
</article>

<svg height="0" width="0">
  <defs>
    <symbol id="chevrons-up" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor">
      <g>
        <path d="m6.293 11.293 1.414 1.414L12 8.414l4.293 4.293 1.414-1.414L12 5.586z" />
        <path d="m6.293 16.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L12 10.586z" />
      </g>
    </symbol>
  </defs>
</svg>
