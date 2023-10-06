const els = document.querySelectorAll(".no-widows-no-orphans");

els.forEach((el) => {
  noWidowsNoOrphans(el);
});

export function noWidowsNoOrphans(el, widowCount = 2, orphanCount = 3) {
  const str = el.textContent.trim();

  const words = str.split(" ");
  const widows = words.slice(0, widowCount);
  const inBetween = words.slice(widowCount, orphanCount * -1);
  const orphans = words.slice(orphanCount * -1);

  console.log(widows);
  console.log(orphans);

  const p = document.createElement("p");
  p.classList.add("no-widows-no-orphans-reformatted");

  const start = document.createElement("span");
  start.classList.add("no-widows");
  start.textContent = widows.join(" ");

  const middle = document.createElement("span");
  middle.textContent = ` ${inBetween.join(" ")} `;

  const end = document.createElement("span");
  end.classList.add("no-orphans");
  end.textContent = orphans.join(" ");

  p.append(start, middle, end);
  el.replaceWith(p);
}
