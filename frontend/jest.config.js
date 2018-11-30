module.exports = {
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: 'jest.tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
