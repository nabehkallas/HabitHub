const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add .cjs and .mjs to the list of source extensions.
// This is necessary for Firebase SDK v9+ to work correctly.
config.resolver.sourceExts.push('cjs', 'mjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
