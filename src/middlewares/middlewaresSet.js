import clientCheck from './clientCheck.js.js';
import isEmptyBody from './isEmptyBody.js';
import csrfHeaderCheck from './secureConf/csrfHeaderCheck.js';
import secureInput from './secureInput.js';

/**
 * Guards that verify the request origin/fingerprint.
 * - Ensures CSRF header is present/valid
 * - Validates client metadata (IP, User-Agent)
 * Use for: public GETs, any route where you want a quick origin sanity check.
 */
export const originGuards = [csrfHeaderCheck, clientCheck];

/**
 * Hardened input guards for high-risk endpoints.
 * - Includes origin guards
 * - Rejects requests with an empty body
 * - Sanitizes user input (keys + HTML escaping)
 * Use for: auth flows, create/update resources, file uploads, anything sensitive.
 * POST/PUT/PATCH/DELETE when a body is expected
 */
export const inputSanitizationGuards = [...originGuards, isEmptyBody, secureInput];

export const secureGuards = [clientCheck, isEmptyBody, secureInput];

