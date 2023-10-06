/* eslint-disable no-undef */
it("has correct page title", () => {
  const page = cy.visit("/");

  page.get("title").should("have.text", "Home");
});

it("has correct page language", () => {
  const page = cy.visit("/");

  page.get("html").invoke("attr", "lang").should("eq", "en-US");
});
