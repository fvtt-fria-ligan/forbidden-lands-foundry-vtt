module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  env: {
    browser: true,
  },

  extends: [
    'eslint:recommended',
    '@typhonjs-fvtt/eslint-config-foundry.js/0.7.9',
    'plugin:prettier/recommended',
  ],

  plugins: [],

  rules: {
    // Specify any specific ESLint rules.
  },

  overrides: [
    {
      files: ['./*.js'],
      env: {
        node: true,
      },
    },
  ],
};
