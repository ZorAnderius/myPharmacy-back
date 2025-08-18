import clientCheck from './clientCheck.js.js';
import isEmptyBody from './isEmptyBody.js';
import csrfHeaderCheck from './secureConf/csrfHeaderCheck.js';

export const csrfAndClientValidation = [csrfHeaderCheck, clientCheck];
export const requestIntegrityChecks = [isEmptyBody, ...csrfAndClientValidation];