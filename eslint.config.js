import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Essential TypeScript rules - balanced approach
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      
      // Essential code quality rules - less strict
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      
      // Function rules - relaxed
      'prefer-arrow-callback': 'off',
      'func-style': 'off',
      'no-invalid-this': 'off',
      
      // Basic formatting rules - balanced
      'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // Disable overly strict rules
      'no-magic-numbers': 'off',
      'complexity': 'off',
      'max-depth': 'off',
      'max-lines': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'prefer-template': 'off',
      'template-curly-spacing': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.e2e-spec.ts'],
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'no-magic-numbers': 'off',
      'max-len': 'off',
    },
  },
  {
    files: ['**/*.dto.ts', '**/*.entity.ts', '**/*.interface.ts'],
    rules: {
      // Relax rules for data model files
      '@typescript-eslint/no-explicit-any': 'off',
      'max-len': 'off',
    },
  },
);
