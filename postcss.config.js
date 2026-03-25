/**
 * PostCSS configuration for HarmonyForge.
 *
 * `removeBrokenFontTemplate` strips the class Tailwind v4.2.x generates as
 * an internal CSS-variable-shorthand template:
 *
 *   .font-[family-name:var(...)] { font-family: var(...); }
 *
 * `...` is not a valid CSS custom-property identifier, so Turbopack's strict
 * CSS parser throws "Unexpected token Delim('.')".
 *
 * This plugin runs after @tailwindcss/postcss in the PostCSS chain and
 * removes the rule before Turbopack's native parser sees it.
 */
const removeBrokenFontTemplate = (opts = {}) => ({
  postcssPlugin: "remove-broken-font-template",
  Rule(rule) {
    // Tailwind v4.2.x generates a CSS variable shorthand template class.
    // In the PostCSS AST the selector is stored with CSS escapes:
    //   .font-\[family-name\:var\(\.\.\.\)\]
    // Check for both the escaped and unescaped forms.
    if (
      rule.selector &&
      (rule.selector.includes("var(...)") ||
        rule.selector.includes("var\\(...\\)") ||
        rule.selector.includes("\\(\\.\\.\\.\\)"))
    ) {
      rule.remove();
    }
  },
});
removeBrokenFontTemplate.postcss = true;

module.exports = {
  plugins: [require("@tailwindcss/postcss"), removeBrokenFontTemplate],
};
