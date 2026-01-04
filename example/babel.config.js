const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = getConfig(
  {
    presets: [
      [
        'module:@react-native/babel-preset',
        { useTransformReactJSXExperimental: true },
      ],
    ],
    plugins: [
      // NativeWind babel plugin (manually configured to avoid resolution issues)
      require('react-native-css-interop/dist/babel-plugin').default,
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'react-native-css-interop',
        },
      ],
      // react-native-worklets/plugin is required by NativeWind's css-interop
      'react-native-worklets/plugin',
    ],
  },
  { root, pkg }
);
