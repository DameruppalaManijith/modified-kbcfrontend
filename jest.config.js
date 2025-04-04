export default {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",  // Use Babel for transforming JS/JSX files
    },
    testEnvironment: "jsdom",  // Set the test environment to jsdom for React testing
    moduleNameMapper: {
      "\\.(css|jpg|png|svg)$": "<rootDir>/__mocks__/fileMock.js",  // Mock static files like CSS and images
    },
    moduleFileExtensions: ['js', 'jsx'], // Handles .js and .jsx extensions
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/"  // Transform axios inside node_modules
    ],
  };
  