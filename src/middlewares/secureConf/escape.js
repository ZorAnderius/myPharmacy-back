/**
 * Escapes special HTML characters in a string to prevent XSS attacks.
 *
 * Characters escaped:
 * - `&` → `&amp;`
 * - `<` → `&lt;`
 * - `>` → `&gt;`
 * - `"` → `&quot;`
 * - `'` → `&#039;`
 * - `` ` `` → `&#96;`
 * - `=` → `&#61;`
 * - `/` → `&#47;`
 *
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string. If input is not a string, returns it unchanged.
 *
 * @example
 * escapeHTML('<script>alert("xss")</script>');
 * // => "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
const escapeHTML = str =>
  typeof str === 'string'
    ? str.replace(
        /[&<>"'`=\/]/g,
        char =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '`': '&#96;',
            '=': '&#61;',
            '/': '&#47;',
          }[char] || char)
      )
    : str;

/**
 * Escapes a string according to a specified context to prevent injection attacks.
 *
 * Supported contexts:
 * - `'html'` — Escapes HTML special characters (uses `escapeHTML`).
 * - `'url'` — Escapes for use in URLs (`encodeURIComponent`).
 * - `'js'` — Escapes quotes and backslashes for JavaScript strings.
 * - `'css'` — Escapes quotes and backslashes for CSS strings.
 * - Default context is `'html'`.
 *
 * @param {string} str - The string to escape.
 * @param {'html'|'url'|'js'|'css'} [context='html'] - The context to escape for.
 * @returns {string} The escaped string. If input is not a string, returns it unchanged.
 *
 * @example
 * escapeByContext('<div>', 'html'); // "&lt;div&gt;"
 * escapeByContext('param=value', 'url'); // "param%3Dvalue"
 * escapeByContext('alert("xss")', 'js'); // "alert(\"xss\")"
 */
const escapeByContext = (str, context = 'html') => {
  if (typeof str !== 'string') return str;
  switch (context) {
    case 'html':
      return escapeHTML(str);
    case 'url':
      return encodeURIComponent(str);
    case 'js':
      return str.replace(/["'\\]/g, char => '\\' + char);
    case 'css':
      return str.replace(/["'\\]/g, char => '\\' + char);
    default:
      return escapeHTML(str);
  }
};

export default escapeByContext;
