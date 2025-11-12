#!/usr/bin/env node

/**
 * Build Verification Script
 * 
 * This script verifies that the production build is ready for deployment.
 * Run with: node scripts/verify-build.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting build verification...\n');

let hasErrors = false;
let hasWarnings = false;

// Check 1: Verify .next directory exists
console.log('✓ Checking build output...');
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.error('❌ ERROR: .next directory not found. Run "npm run build" first.');
  hasErrors = true;
} else {
  console.log('  ✅ .next directory exists');
}

// Check 2: Verify environment variables
console.log('\n✓ Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_UNSPLASH_ACCESS_KEY',
  'NEXT_PUBLIC_OPENWEATHER_API_KEY',
  'NEXT_PUBLIC_GEMINI_API_KEY'
];

const placeholderPatterns = [
  'your_',
  'placeholder',
  'example',
  'test_key',
  'abc123',
  'xxx'
];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.warn(`  ⚠️  WARNING: ${varName} is not set`);
    hasWarnings = true;
  } else if (placeholderPatterns.some(pattern => value.toLowerCase().includes(pattern))) {
    console.warn(`  ⚠️  WARNING: ${varName} appears to be a placeholder value`);
    hasWarnings = true;
  } else {
    console.log(`  ✅ ${varName} is configured`);
  }
});

// Check 3: Verify package.json scripts
console.log('\n✓ Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['dev', 'build', 'start', 'lint'];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`  ✅ Script "${script}" is defined`);
  } else {
    console.error(`  ❌ ERROR: Script "${script}" is missing`);
    hasErrors = true;
  }
});

// Check 4: Verify next.config.mjs exists
console.log('\n✓ Checking Next.js configuration...');
if (fs.existsSync('next.config.mjs')) {
  console.log('  ✅ next.config.mjs exists');
  
  // Check for image domains
  const configContent = fs.readFileSync('next.config.mjs', 'utf8');
  if (configContent.includes('images.unsplash.com')) {
    console.log('  ✅ Unsplash image domain configured');
  } else {
    console.warn('  ⚠️  WARNING: Unsplash image domain not found in config');
    hasWarnings = true;
  }
} else {
  console.error('  ❌ ERROR: next.config.mjs not found');
  hasErrors = true;
}

// Check 5: Verify vercel.json exists
console.log('\n✓ Checking Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  console.log('  ✅ vercel.json exists');
} else {
  console.warn('  ⚠️  WARNING: vercel.json not found (optional but recommended)');
  hasWarnings = true;
}

// Check 6: Verify .env.example exists
console.log('\n✓ Checking environment documentation...');
if (fs.existsSync('.env.example')) {
  console.log('  ✅ .env.example exists');
} else {
  console.error('  ❌ ERROR: .env.example not found');
  hasErrors = true;
}

// Check 7: Verify critical dependencies
console.log('\n✓ Checking dependencies...');
const criticalDeps = ['next', 'react', 'react-dom', 'framer-motion', 'zustand', 'axios'];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep} is installed`);
  } else {
    console.error(`  ❌ ERROR: ${dep} is missing from dependencies`);
    hasErrors = true;
  }
});

// Check 8: Verify build artifacts
console.log('\n✓ Checking build artifacts...');
const buildManifest = path.join(nextDir, 'build-manifest.json');
if (fs.existsSync(buildManifest)) {
  console.log('  ✅ Build manifest exists');
} else {
  console.error('  ❌ ERROR: Build manifest not found');
  hasErrors = true;
}

// Check for App Router pages
const appBuildDir = path.join(nextDir, 'server', 'app');
if (fs.existsSync(appBuildDir)) {
  console.log('  ✅ App Router build directory exists');
  
  // Check for required routes
  const indexPage = path.join(appBuildDir, 'page.js');
  const explorePage = path.join(appBuildDir, 'explore', 'page.js');
  
  if (fs.existsSync(indexPage)) {
    console.log('  ✅ Landing page (/) built');
  } else {
    console.error('  ❌ ERROR: Landing page not found');
    hasErrors = true;
  }
  
  if (fs.existsSync(explorePage)) {
    console.log('  ✅ Explore page (/explore) built');
  } else {
    console.error('  ❌ ERROR: Explore page not found');
    hasErrors = true;
  }
} else {
  console.error('  ❌ ERROR: App Router build directory not found');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));

if (hasErrors) {
  console.error('\n❌ BUILD VERIFICATION FAILED');
  console.error('Please fix the errors above before deploying.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  BUILD VERIFICATION PASSED WITH WARNINGS');
  console.warn('Review the warnings above. The build may work but could have issues.\n');
  process.exit(0);
} else {
  console.log('\n✅ BUILD VERIFICATION PASSED');
  console.log('The application is ready for deployment!\n');
  process.exit(0);
}
