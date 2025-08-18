import Joi from "joi";

const authWithGoogleOAuthSchema = Joi.object({
    code: Joi.string().required().messages({
        'string.base': 'Code must be a string',
        'string.empty': 'Code is required',
        'any.required': 'Code is required'
    })
});

export default authWithGoogleOAuthSchema;
