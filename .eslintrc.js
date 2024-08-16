module.exports = {
extends: ["standard-with-typescript","prettier"],
 parserOptions: {
 project: "./tsconfig.json",
 },
 rules: {
  "@typescript-eslint/promise-function-async": "off",
 "@typescript-eslint/no-misused-promises": "off",
 "@typescript-eslint/consistent-type-assertions": "off",
 "@typescript-eslint/no-floating-promises": "off",
 "@typescript-eslint/strict-boolean-expressions": "off",
 "@typescript-eslint/explicit-function-return-type": "off",
 "@typescript-eslint/naming-convention": "off",
      '@typescript-eslint/no-explicit-any': 'warn'
 },
};