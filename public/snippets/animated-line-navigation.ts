const navElem = document.getElementById("nav-main");
const navLinkElems = document.querySelectorAll(".nav__link");

nav(navElem, navLinkElems);

function textPosition(elem) {
  let rect = elem.getBoundingClientRect();

  console.log("x:", rect.x);
  console.log("y:", rect.y);

  return rect;
}

function textWidthInPx(elem) {
  const compStyles = window.getComputedStyle(elem);

  const fontWeight = compStyles.getPropertyValue("font-weight") || 800;
  const fontSize = compStyles.getPropertyValue("font-size");
  const fontFamily = compStyles.getPropertyValue("font-family");
  const letterSpacing = compStyles.getPropertyValue("letter-spacing");
  const textTransform = compStyles.getPropertyValue("text-transform");
  const font = `${fontWeight} ${fontSize} ${fontFamily}`;

  let text = elem.innerText;

  if (textTransform === "uppercase") {
    text.toUpperCase();
  }

  if (textTransform === "lowercase") {
    text.toLowerCase();
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = font;
  context.letterSpacing = letterSpacing;
  const { width } = context.measureText(text);

  console.log(text);
  console.log(textTransform);
  console.log(context);
  console.log(text);
  console.log(width);

  return width;
}

function appendNavLinkLine(navElem) {
  let navLinkLineElem = document.createElement("div");
  navLinkLineElem.classList.add("nav__link-line");
  navElem.append(navLinkLineElem);

  return navLinkLineElem;
}

function handleNavLinkLine(navLinkElem, navLinkLineElem) {
  const navLinkPos = textPosition(navLinkElem);
  const navLinkTextWidth = textWidthInPx(navLinkElem);

  const compStyles = window.getComputedStyle(navLinkElem);
  const paddingLeft = compStyles.getPropertyValue("padding-left");
  const paddingLeftInt = parseInt(paddingLeft);
  const posLeft = navLinkPos.x + paddingLeftInt;

  let root = document.documentElement;

  const viewportWidth = window.innerWidth;
  const navLineHeight = (viewportWidth / navLinkTextWidth) * 2;

  root.style.setProperty("--nav-line-width", `${navLinkTextWidth}px`);
  root.style.setProperty("--nav-line-height", `${navLineHeight}px`);
  root.style.setProperty("--nav-line-left", `${posLeft}px`);

  navLinkLineElem.classList.add("is-active");
}

function nav(navElem, navLinkElems) {
  const navLinkLineElem = appendNavLinkLine(navElem);

  for (let i = 0; i < navLinkElems.length; i++) {
    const navLinkElem = navLinkElems[i];

    navLinkElem.addEventListener("mouseover", function (event) {
      handleNavLinkLine(event.currentTarget, navLinkLineElem);
    });

    navLinkElem.addEventListener("mouseout", function () {
      navLinkLineElem.classList.remove("is-active");

      const navLinkActiveElem = document.querySelector(".nav__link.is-active");

      if (navLinkActiveElem) {
        handleNavLinkLine(navLinkActiveElem, navLinkLineElem);
      }
    });

    navLinkElem.addEventListener("click", function (event) {
      const targetElem = event.currentTarget;

      for (let i = 0; i < navLinkElems.length; i++) {
        if (navLinkElems[i] !== targetElem) {
          navLinkElems[i].classList.remove("is-active");
          navElem.classList.remove("is-expanded");
        }
      }

      targetElem.classList.toggle("is-active");

      setTimeout(function () {
        handleNavLinkLine(targetElem, navLinkLineElem);
      }, 10);

      if (targetElem.classList.contains("is-active")) {
        navElem.classList.add("is-expanded");
      } else {
        navElem.classList.remove("is-expanded");
      }
    });
  }
}
