module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*|@react-native-community)/)',
  ],
  moduleNameMapper: {
    '^react-native-fabric-html-text$':
      '<rootDir>/__mocks__/react-native-fabric-html-text.js',
    '^react-native-fabric-html-text/nativewind$':
      '<rootDir>/__mocks__/react-native-fabric-html-text-nativewind.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
};
