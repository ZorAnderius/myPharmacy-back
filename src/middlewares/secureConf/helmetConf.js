/**
 * Security configuration options for Helmet middleware in Express.
 *
 * @typedef {Object} HelmetOptions
 * @property {Object} contentSecurityPolicy - Configuration for Content Security Policy (CSP) headers.
 * @property {Object} contentSecurityPolicy.directives - CSP directives specifying allowed sources for different types of content.
 * @property {string[]} contentSecurityPolicy.directives.defaultSrc - Default sources for all content types.
 * @property {string[]} contentSecurityPolicy.directives.baseUri - Allowed base URIs.
 * @property {string[]} contentSecurityPolicy.directives.fontSrc - Allowed font sources.
 * @property {string[]} contentSecurityPolicy.directives.formAction - Allowed form action URLs.
 * @property {string[]} contentSecurityPolicy.directives.frameAncestors - Allowed frame ancestors.
 * @property {string[]} contentSecurityPolicy.directives.imgSrc - Allowed image sources.
 * @property {string[]} contentSecurityPolicy.directives.objectSrc - Allowed object sources.
 * @property {string[]} contentSecurityPolicy.directives.scriptSrc - Allowed script sources.
 * @property {string[]} contentSecurityPolicy.directives.scriptSrcAttr - Allowed inline script attributes.
 * @property {string[]} contentSecurityPolicy.directives.styleSrc - Allowed style sources.
 * @property {Array} contentSecurityPolicy.directives.upgradeInsecureRequests - Empty array enables upgrade of insecure requests.
 * @property {Object} referrerPolicy - Referrer policy configuration.
 * @property {string} referrerPolicy.policy - Referrer policy value (e.g., 'no-referrer').
 * @property {Object} crossOriginOpenerPolicy - Cross-Origin-Opener-Policy header configuration.
 * @property {string} crossOriginOpenerPolicy.policy - COOP policy value (e.g., 'same-origin').
 * @property {Object} crossOriginResourcePolicy - Cross-Origin-Resource-Policy header configuration.
 * @property {string} crossOriginResourcePolicy.policy - CORP policy value (e.g., 'same-origin').
 * @property {Object} hsts - HTTP Strict Transport Security configuration.
 * @property {number} hsts.maxAge - Max age in seconds for HSTS.
 * @property {boolean} hsts.includeSubDomains - Whether to include subdomains in HSTS.
 * @property {Object} frameguard - Frameguard configuration to prevent clickjacking.
 * @property {string} frameguard.action - Frameguard action (e.g., 'sameorigin').
 * @property {boolean} noSniff - Sets X-Content-Type-Options to 'nosniff'.
 *
 * @usage
 * app.use(helmet(helmetOptions));
 */
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
};

export default helmetOptions;
