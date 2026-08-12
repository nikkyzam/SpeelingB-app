# 🧪 Cypress E2E Testing - Kids Spelling Bee

This document outlines the setup and usage of Cypress for end-to-end testing.

## 🚀 Quick Start

- **Install**: `npm install`
- **Run Cypress UI**: `npm run cy:open`
- **Run tests headlessly**: `npm run test:e2e`

## ⚙️ Configuration

- `cypress.config.cjs`: Main configuration (uses .cjs for CommonJS compatibility).
- `.cypress.env.json`: Environment variables (API keys, etc.). **Do not commit.**
- `cypress/support/commands.js`: Custom commands.
- `cypress/support/e2e.js`: Global hooks.

## 📂 Directory Structure

- `cypress/e2e/`: Test files.
- `cypress/fixtures/`: Test data.
- `cypress/support/`: Reusable commands and setup.
- `cypress/reports/`: Test reports.

## 🌐 CI/CD

A GitHub Actions workflow in `.github/workflows/cypress-tests.yml` runs tests on every push.
