const whitelist = [
  'https://my-pharmacy-web-green.vercel.app', 
  'http://localhost:3000', 
  'http://localhost:5179', 
  'https://fixer-upper-front.vercel.app', 
  'https://fixerupper-front.vercel.app',
  'https://fixerupper-front.vercel.app',
  'https://fixer-upper-front.vercel.app'
];

/**
 * CORS configuration options for Express.
 *
 * @typedef {Object} CorsOptions
 * @property {function(string|null, function(Error|null, boolean)): void} origin - Function to check if the request origin is allowed.
 * If `origin` is in the whitelist or missing, the callback is called with `true`. Otherwise, an error is passed.
 * @property {boolean} credentials - Indicates whether to allow credentials (cookies, authorization headers) in CORS requests.
 *
 * @usage
 * app.use(cors(corsOptions));
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'X-Csrf-Token', 'X-CSRF-Token', 'Accept'],
  credentials: true,
};

export default corsOptions;
