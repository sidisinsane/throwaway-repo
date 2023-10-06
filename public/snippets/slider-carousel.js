/** @type {NodeListOf<Element>} sliderCarouselEls */
const elements = document.querySelectorAll(".slider-carousel");

elements.forEach((element, index) => {
  sliderCarousel({
    parentEl: element,
    idPrefix: `slider-carousel-${index + 1}-item`,
  });
});

/**
 * @typedef {Object} SliderCarouselProps
 * @property {HTMLElement} parentEl
 * @property {string} [idPrefix]
 * @property {string} [cssVariable]
 */

/**
 * sliderCarousel
 * @description Creates slider carousel
 * @param {SliderCarouselProps} props
 * @returns void
 */
function sliderCarousel(props) {
  const {
    parentEl,
    idPrefix = "slider-carousel-item",
    cssVariable = "--slider-carousel-items-per-screen",
  } = props;

  const items = parentEl.querySelectorAll(".slider-carousel__item");

  // eslint-disable-next-line prefer-const
  let itemsPerScreen = getItemsPerScreen();

  init();
  // Add event listeners for resize and orientationchange
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);

  /**
   * handleResize
   * @description Handles resize and orientationchange events
   * @returns void
   */
  function handleResize() {
    buildNav();

    items.forEach((item) => {
      intersectionObserver().observe(item);
    });
  }

  /**
   * init
   * @description Initializes slider carousel
   */
  function init() {
    initializeSliderCarouselItems();
    buildNav();

    items.forEach((item) => {
      intersectionObserver().observe(item);
    });
  }

  /**
   * initializeSliderCarouselItems
   * @description Initializes slider carousel items
   */
  function initializeSliderCarouselItems() {
    items.forEach((item, index) => {
      const itemId = `${idPrefix}-${index + 1}`;
      item.id = itemId;
      item.setAttribute("data-index", `${index + 1}`);
    });
  }

  /**
   * buildNav
   * @description Creates navigation element and adds links to it
   * @returns {HTMLElement} - Navigation element
   */
  function buildNav() {
    const currNavEl = parentEl.querySelector(".slider-carousel__nav");

    // Check if necessary elements exist
    if (!parentEl || !items) {
      return;
    }

    const itemsArray = Array.from(items);
    const currItemsPerScreen = getItemsPerScreen();
    if (currNavEl && itemsPerScreen === currItemsPerScreen) {
      return;
    }

    console.log("rebuild nav");

    itemsPerScreen =
      itemsPerScreen !== currItemsPerScreen
        ? currItemsPerScreen
        : itemsPerScreen;
    const linksPerNavItem = Math.ceil(items.length / itemsPerScreen);

    const navEl = document.createElement("nav");
    navEl.classList.add("slider-carousel__nav");

    for (let i = 0; i < linksPerNavItem; i++) {
      const navItemEl = document.createElement("li");
      navItemEl.classList.add("slider-carousel__nav-item");
      navEl.appendChild(navItemEl);

      for (
        let j = 0;
        j < itemsPerScreen && i * itemsPerScreen + j < itemsArray.length;
        j++
      ) {
        const index = i * itemsPerScreen + j;
        const item = itemsArray[index];
        const itemId = item.id;
        const itemDataIndex = item.getAttribute("data-index");

        const navLinkEl = document.createElement("a");
        navLinkEl.setAttribute("href", `#${itemId}`);
        navLinkEl.classList.add("slider-carousel__nav-link");
        navLinkEl.setAttribute("data-index", `${itemDataIndex}`);
        navLinkEl.innerHTML = "&bull;";
        navLinkEl.addEventListener("click", (evt) => {
          evt.preventDefault();
          item.scrollIntoView(false);
        });

        navItemEl.appendChild(navLinkEl);
      }
    }

    if (currNavEl) {
      currNavEl.remove();
    }

    parentEl.appendChild(navEl);
  }

  /**
   * getItemsPerScreen
   * @description Gets the number of items per screen from the CSS variable
   * @param {GetItemsPerScreenArgs} args - Arguments for the function
   * @returns {number} - The number of items per screen
   */
  function getItemsPerScreen() {
    if (!parentEl) {
      return 0;
    }

    return parseFloat(getComputedStyle(parentEl).getPropertyValue(cssVariable));
  }

  /**
   * intersectionObserver
   * @description Intersections observer
   * @returns {IntersectionObserver} observer
   */
  function intersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          const dataIndex = item.getAttribute("data-index");
          const link = parentEl.querySelector(
            `.slider-carousel__nav-link[data-index="${dataIndex}"]`,
          );

          if (entry.isIntersecting) {
            item.classList.add("active");
            link?.classList.add("active");
          } else {
            item.classList.remove("active");
            link?.classList.remove("active");
          }
        });
      },
      {
        root: parentEl,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    return observer;
  }
}
