import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import stylisticJs from '@stylistic/eslint-plugin-js'
import jsxA11y from 'eslint-plugin-jsx-a11y'

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginReact.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  pluginReact.configs.flat['jsx-runtime'],
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: pluginReact,
      '@stylistic/js': stylisticJs,
      'jsx-a11y': jsxA11y
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: '19.0.0',
      },
      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: true,
      },
    },
  },
  {
    rules: {
      'react/prefer-es6-class': 'error',
      'react/prefer-stateless-function': 'error',
      'react/jsx-closing-bracket-location': 'warn',
      'react/jsx-closing-tag-location': 'warn',
      'react/button-has-type': 'error',
      'react/no-unused-prop-types': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-script-url': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/jsx-fragments': 'error',
      'react/destructuring-assignment': [
        'error',
        'always',
        { destructureInSignature: 'always' },
      ],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/jsx-max-depth': ['error', { max: 5 }],
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/no-typos': 'warn',
      'react/display-name': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',
      '@stylistic/js/jsx-quotes': 'warn',
      'jsx-quotes': 'warn',
      'no-multi-spaces': 'warn',
      'react/jsx-tag-spacing': 'warn',
      'react/jsx-boolean-value': 'warn',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/aria-role': 'error',
      'react/no-string-refs': 'error',
      'react/jsx-wrap-multilines': 'warn',
      'react/jsx-no-bind': 'error',
      'react/require-render-return': 'error',
      'react/sort-comp': 'warn',
      'react/no-is-mounted': 'error'
    },
  },
  {
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/features/*', // Apply restriction to all features
              from: './src/features', // Prevent imports from other features
              except: ['./*'], // Allow imports from the same feature
            },
            {
              target: './src/js/components', // You could define other shared modules
              from: './src/features', // Allow features to import from components
              except: ['./*'], // Allow features to import their own components
            },
            // enforce unidirectional codebase:
            // e.g. src/app can import from src/features but not the other way around
            {
              target: './src/features',
              from: './src/app',
            },

            // e.g src/features and src/app can import from these shared modules but not the other way around
            {
              target: [
                './src/js/components',
                './src/js/hooks',
                './src/js/lib',
                './src/js/types',
                './src/js/utils',
              ],
              from: ['./src/js/features', './src/js/app'],
            },
          ],
        },
      ],
    },
  },
]
