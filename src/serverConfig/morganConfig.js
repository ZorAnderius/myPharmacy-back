import morgan from 'morgan';

const colors = {
    GET: '\x1b[32m',
    POST: '\x1b[34m',
    PUT: '\x1b[33m',
    DELETE: '\x1b[31m',
    RESET: '\x1b[0m',
    URL: '\x1b[36m',
};

morgan.format('tiny-colored', (tokens, req, res) => {
    const method = tokens.method(req, res);
    const color = colors[method] || colors.RESET;
    return `${color}${method} ${color.URL}${tokens.url(req, res)} ${color}${tokens.status(req, res)} - ${tokens['response-time'](req, res)} ms${colors.RESET};`;
});

export default morgan;
