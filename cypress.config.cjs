const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  projectId: 'kids-spelling-bee',
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 15000,
  execTimeout: 60000,
  pageLoadTimeout: 60000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  retries: { runMode: 2, openMode: 0 },
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  trashAssetsBeforeRuns: true,
  video: true,
  videosFolder: 'cypress/videos',
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'yyyy-mm-dd_HH-MM-ss',
  },
  env: {
    baseUrl: 'http://localhost:5173',
    apiUrl: 'http://localhost:3000/api',
    TEST_USER_EMAIL: 'test@example.com',
    TEST_USER_PASSWORD: 'TestPassword123!',
    JOY_USER_EMAIL: 'joy@example.com',
    JOY_USER_PASSWORD: 'JoyPassword123!',
  },
  experimentalMemoryManagement: true,
  experimentalSessionAndOrigin: true,
  numTestsKeptInMemory: 50,
  e2e: {
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/__snapshots__/*'],
    setupNodeEvents(on, config) {
      require('dotenv').config();
      require('@cypress/code-coverage/task')(on, config);
      on('task', {
        log(message) { console.log('📝 Cypress Task Log:', message); return null; },
        readFileIfExists(filename) {
          const filepath = path.join(__dirname, 'cypress', 'test-data', filename);
          return fs.existsSync(filepath) ? fs.readFileSync(filepath, 'utf8') : null;
        },
        getTestUser(type) {
          const users = {
            'regular': { name: 'Test User', email: config.env.TEST_USER_EMAIL, password: config.env.TEST_USER_PASSWORD, dailyGoal: 30 },
            'joy': { name: 'Joy Johnson', email: config.env.JOY_USER_EMAIL, password: config.env.JOY_USER_PASSWORD, dailyGoal: 10 },
          };
          return users[type] || users.regular;
        },
      });
      return config;
    },
    baseUrl: 'http://localhost:5173',
  },
  component: {
    devServer: { framework: 'react', bundler: 'vite' },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
});
