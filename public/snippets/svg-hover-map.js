const elements = document.querySelectorAll(
  `.svg-hover-map path, .svg-hover-map-list [data-map]`,
);

elements.forEach(function (element) {
  element.addEventListener("mouseenter", function () {
    setActive(element);
  });

  element.addEventListener("mouseleave", function () {
    unsetAll(elements);
  });

  element.addEventListener("touchstart", function () {
    unsetAll(elements);
    setActive(element);
  });
});

function unsetAll(elements) {
  elements.forEach(function (element) {
    element.classList.remove("is-active");
  });
}

function setActive(element) {
  const isMapPath = !element.hasAttribute("data-map");
  const counterPartSelector = isMapPath
    ? `[data-map="${element.getAttribute("id")}"]`
    : `#${element.getAttribute("data-map")}`;
  const counterPart = document.querySelector(counterPartSelector);

  element.classList.add("is-active");
  counterPart.classList.add("is-active");
}
