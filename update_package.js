const fs = require('fs');
const path = require('path');
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
