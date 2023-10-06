const parents = document.querySelectorAll(".background-sliding-animation");

parents.forEach((parent) => {
  const items = parent.querySelectorAll(".background-sliding-animation__item");

  items.forEach((item) => {
    item.addEventListener("mouseover", function () {
      const link = item.querySelector(".background-sliding-animation__link");
      const height = link.offsetHeight;
      const top = link.offsetTop;

      parent?.style.setProperty("--height", `${height}px`);
      parent?.style.setProperty("--y", `${top}px`);
    });
  });
});
