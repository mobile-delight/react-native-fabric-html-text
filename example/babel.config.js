const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

const isTestEnv = process.env.NODE_ENV === 'test';

// NativeWind preset and worklets plugin - skip in Jest test environment
const nativewindPresets = isTestEnv ? [] : ['nativewind/babel'];
const nativewindPlugins = isTestEnv ? [] : ['react-native-worklets/plugin'];

module.exports = getConfig(
  {
    presets: [
      [
        'module:@react-native/babel-preset',
        { useTransformReactJSXExperimental: true },
      ],
      // NativeWind babel preset (must be a preset, not plugin)
      ...nativewindPresets,
    ],
    plugins: [
      // react-native-worklets/plugin is required by NativeWind's css-interop
      ...nativewindPlugins,
    ],
  },
  { root, pkg }
);
