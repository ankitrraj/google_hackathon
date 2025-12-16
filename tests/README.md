# Tests

This folder contains test scripts and utilities for VoiceForge.

## Available Tests

### `test-gemini.js`
Tests Gemini API integration and agent generation.

```bash
node tests/test-gemini.js
```

### `check-gemini-models.js`
Checks which Gemini models are available with your API key.

```bash
node tests/check-gemini-models.js
```

## Running Tests

Make sure you have `.env.local` configured with valid API keys before running tests.

```bash
# Install dependencies first
npm install

# Run a specific test
node tests/test-gemini.js
```

## Adding New Tests

1. Create a new `.js` file in this folder
2. Add description in this README
3. Use `require('dotenv').config({ path: '.env.local' })` to load env vars
4. Follow existing test patterns
