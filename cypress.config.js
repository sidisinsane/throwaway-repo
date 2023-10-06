import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4321",
    supportFile: false,
    specPattern: "tests/e2e/cypress/**/*.cy.{js,jsx,ts,tsx}",
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "coverage/e2e/cypress",
    overwrite: true,
    html: true,
    json: true,
  },
  downloadsFolder: "tests/e2e/cypress/downloads",
  fixturesFolder: "tests/e2e/cypress/fixtures",
  screenshotsFolder: "tests/e2e/cypress/screenshots",
  videosFolder: "tests/e2e/cypress/videos",
});
