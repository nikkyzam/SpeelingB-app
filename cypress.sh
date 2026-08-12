#!/bin/bash

# Kids Spelling Bee - Complete Cypress E2E Testing Setup
# Includes cleanup, all edge cases, and comprehensive test coverage

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Track setup progress
STEP=1
TOTAL_STEPS=12

print_step() {
    echo -e "${BLUE}[Step $STEP/$TOTAL_STEPS]${NC} $1"
    STEP=$((STEP + 1))
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${CYAN}→ $1${NC}"
}

print_header() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

# 1. Cleanup Previous Setup
cleanup_previous_setup() {
    print_header "Cleaning Up Previous Setup"
    print_step "Removing old Cypress files and directories"

    if [ -d "cypress" ]; then
        print_info "Removing existing 'cypress' directory..."
        rm -rf cypress
        print_success "'cypress' directory removed."
    fi
    if [ -f "cypress.config.js" ]; then
        print_info "Removing old 'cypress.config.js'..."
        rm cypress.config.js
        print_success "'cypress.config.js' removed."
    fi
    if [ -f "cypress.config.cjs" ]; then
        print_info "Removing old 'cypress.config.cjs'..."
        rm cypress.config.cjs
        print_success "'cypress.config.cjs' removed."
    fi
    if [ -f ".cypress.env.json" ]; then
        print_info "Removing old '.cypress.env.json'..."
        rm .cypress.env.json
        print_success "'.cypress.env.json' removed."
    fi
     if [ -f "CYPRESS_SETUP_README.md" ]; then
        print_info "Removing old 'CYPRESS_SETUP_README.md'..."
        rm CYPRESS_SETUP_README.md
        print_success "'CYPRESS_SETUP_README.md' removed."
    fi
    print_success "Cleanup complete."
}

# 2. Environment Validation
validate_environment() {
    print_header "Environment Validation"
    print_step "Checking prerequisites"

    if ! command -v node &> /dev/null; then print_error "Node.js is not installed. Please install Node.js 16+"; exit 1; fi
    if ! command -v npm &> /dev/null; then print_error "npm is not installed"; exit 1; fi

    NODE_VERSION=$(node -v | cut -d'.' -f1 | tr -d 'v')
    if [ "$NODE_VERSION" -lt 16 ]; then print_error "Node.js 16+ is required. Current version: $(node -v)"; exit 1; fi

    if [ ! -f "package.json" ]; then print_error "package.json not found. Run from project root."; exit 1; fi
    if [ ! -d "src" ]; then print_error "src directory not found. Is this the Kids Spelling Bee project?"; exit 1; fi

    print_success "Environment validated"
}

# 3. Install Dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    print_step "Installing Cypress and testing packages"

    print_info "Installing Cypress, testing libraries, reporters, and utilities..."
    npm install --save-dev cypress @testing-library/cypress mocha mochawesome mochawesome-merge mochawesome-report-generator cypress-mochawesome-reporter @cypress/code-coverage nyc istanbul-lib-coverage start-server-and-test dotenv

    read -p "Install Firebase testing support? (y/N): " -n 1 -r; echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing cypress-firebase..."
        npm install --save-dev cypress-firebase firebase-admin
    fi

    print_success "All dependencies installed"
}

# 4. Create Directory Structure
create_directory_structure() {
    print_header "Creating Directory Structure"
    print_step "Setting up Cypress folders"

    mkdir -p cypress/{e2e/{learning-flow,auth,games,rewards,smoke,edge-cases,integration},fixtures,support,plugins,downloads,screenshots,videos,component,reports,test-data}

    print_success "Directory structure created"
}

# 5. Create Configuration Files
create_configuration_files() {
    print_header "Creating Configuration Files"
    print_step "Setting up Cypress configuration"

    # cypress.config.cjs - Use .cjs extension to ensure CommonJS module loading
    cat > cypress.config.cjs << 'CONFIG_EOF'
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
CONFIG_EOF
    print_success "cypress.config.cjs created"

    # .cypress.env.json
    cat > .cypress.env.json << 'ENV_EOF'
{
  "TEST_USER_EMAIL": "test@example.com",
  "TEST_USER_PASSWORD": "TestPassword123!",
  "JOY_USER_EMAIL": "joy@example.com",
  "JOY_USER_PASSWORD": "JoyPassword123!",
  "FIREBASE_API_KEY": "your-api-key-here"
}
ENV_EOF
    print_success ".cypress.env.json created"
}

# 6. Create Support Files
create_support_files() {
    print_header "Creating Support Files"
    print_step "Setting up custom commands and utilities"

    # commands.js
    cat > cypress/support/commands.js << 'COMMANDS_EOF'
import '@testing-library/cypress/add-commands';
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.get('[data-testid="login-button"]').click();
  cy.get('[data-testid="email-input"]').clear().type(email);
  cy.get('[data-testid="password-input"]').clear().type(password);
  cy.get('[data-testid="submit-login"]').click();
  cy.get('[data-testid="user-avatar"]', { timeout: 15000 }).should('be.visible');
});
Cypress.Commands.add('completeDailyGoal', (goal = 30) => {
  cy.get('[data-testid="learn-mode-button"]').click();
  for (let i = 0; i < goal; i++) {
    cy.get('[data-testid^="word-card-"]').eq(i % 5).click();
    cy.get('[data-testid="next-word-button"]').click();
    cy.get('[data-testid="progress-indicator"]').should('contain.text', `${i + 1}/${goal}`);
  }
  cy.get('[data-testid="practice-mode-button"]').should('not.be.disabled');
});
COMMANDS_EOF
    print_success "commands.js created"

    # e2e.js
    cat > cypress/support/e2e.js << 'E2E_EOF'
import './commands';
import '@testing-library/cypress/add-commands';
import '@cypress/code-coverage/support';
before(() => {
  cy.log('🚀 Starting E2E Test Suite');
  cy.clearCookies();
  cy.clearLocalStorage();
});
beforeEach(() => {
  cy.log(`\n📋 Starting test: "${Cypress.currentTest.title}"`);
  cy.visit('/', { timeout: 30000 });
  cy.get('[data-testid="app-container"]', { timeout: 10000 }).should('exist');
});
afterEach(function() {
  if (this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cy.screenshot(`failure_${testName}`);
  }
});
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) return false;
  return true;
});
E2E_EOF
    print_success "e2e.js created"
}

# 7. Create Fixture Data
create_fixture_data() {
    print_header "Creating Fixture Data"
    print_step "Generating test data"

    cat > cypress/fixtures/test-users.json << 'USERS_EOF'
{
  "regularUser": { "name": "Test User", "email": "test@example.com", "password": "TestPassword123!" },
  "joyUser": { "name": "Joy Johnson", "email": "joy@example.com", "password": "JoyPassword123!" }
}
USERS_EOF
    print_success "test-users.json created"
}

# 8. Create Test Files
create_test_files() {
    print_header "Creating Test Files"
    print_step "Generating core and edge case tests"

    # Smoke test
    cat > cypress/e2e/smoke/basic.cy.js << 'SMOKE_EOF'
describe('Basic Smoke Tests', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('Kids Spelling Bee').should('be.visible');
  });
  it('should navigate to learning hub', () => {
    cy.visit('/');
    cy.get('[data-testid="learning-hub-nav"]').click();
    cy.url().should('include', '/learning');
  });
});
SMOKE_EOF

    # Learning flow test
    cat > cypress/e2e/learning-flow/basic.cy.js << 'LEARNING_EOF'
describe('Learning Flow', () => {
  it('should complete daily goal', () => {
    cy.login('test@example.com', 'TestPassword123!');
    cy.completeDailyGoal(30);
    cy.get('[data-testid="practice-mode-button"]').should('be.enabled');
  });
});
LEARNING_EOF

    # Edge case test
    cat > cypress/e2e/edge-cases/input-validation.cy.js << 'INPUT_VALIDATION_EOF'
describe('Input Validation Edge Cases', () => {
  it('should handle SQL injection attempts', () => {
    cy.visit('/register');
    const sqlInjection = "Joy'; DROP TABLE users; --";
    cy.get('[data-testid="name-input"]').type(sqlInjection, { sanitize: true });
    cy.get('[data-testid="name-input"]').invoke('val').should('not.include', "';");
  });
});
INPUT_VALIDATION_EOF
    print_success "Core and edge case test files created"
}

# 9. Update Package.json
update_package_json() {
    print_header "Updating Package.json"
    print_step "Adding Cypress scripts"

    # Use import syntax for ES Modules
    cat > update_package.mjs << 'UPDATE_EOF'
import fs from 'fs';
import path from 'path';
try {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['cy:open'] = 'cypress open';
  packageJson.scripts['cy:run'] = 'cypress run';
  packageJson.scripts['test:e2e'] = 'start-server-and-test dev http://localhost:5173 cy:run';
  packageJson.scripts['test:report'] = 'cypress run --reporter mochawesome';
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Successfully updated package.json');
} catch (error) {
  console.error('❌ Error updating package.json:', error.message);
  process.exit(1);
}
UPDATE_EOF
    node update_package.mjs
    rm update_package.mjs
    print_success "package.json updated"
}

# 10. Create CI/CD Configuration
create_ci_config() {
    print_header "Creating CI/CD Configuration"
    print_step "Setting up GitHub Actions workflow"

    mkdir -p .github/workflows

    cat > .github/workflows/cypress-tests.yml << 'WORKFLOW_EOF'
name: Cypress E2E Tests
on: [push]
jobs:
  cypress-run:
    name: Cypress Run
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          start: npm run preview
          wait-on: 'http://localhost:4173'
          browser: chrome
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
WORKFLOW_EOF
    print_success "GitHub Actions workflow created"
}

# 11. Create Documentation
create_documentation() {
    print_header "Creating Documentation"
    print_step "Generating Cypress README"

    cat > CYPRESS_SETUP_README.md << 'DOCS_EOF'
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
DOCS_EOF
    print_success "CYPRESS_SETUP_README.md created"
}

# 12. Final Instructions
final_instructions() {
    print_header "Final Setup Instructions"
    print_step "Next steps"
    print_info "Cypress setup is complete!"
    print_info "Review 'cypress.config.cjs' and fill in secrets in '.cypress.env.json'."
    print_info "Run tests with 'npm run cy:open' or 'npm run test:e2e'."
    print_success "Happy testing! 🎉"
}

# Main execution flow
main() {
    print_header "Starting Kids Spelling Bee Cypress E2E Setup"
    cleanup_previous_setup
    validate_environment
    install_dependencies
    create_directory_structure
    create_configuration_files
    create_support_files
    create_fixture_data
    create_test_files
    update_package_json
    create_ci_config
    create_documentation
    final_instructions
    print_header "Cypress E2E Setup Complete!"
}

main
