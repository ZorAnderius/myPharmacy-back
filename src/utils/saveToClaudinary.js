import cloudinary from 'cloudinary';
import ENV_VARIABLES from "../constants/ENV_VARIABLES.js";
import env from "./envConfig.js";
import upload from '../middlewares/upload.js';

const CLOUDINARY_NAME = env(ENV_VARIABLES.CLOUDINARY.NAME);
const CLOUDINARY_API_KEY = env(ENV_VARIABLES.CLOUDINARY.API_KEY);
const CLOUDINARY_API_SECRET = env(ENV_VARIABLES.CLOUDINARY.API_SECRET);

/**
 * Configures the Cloudinary SDK with API credentials and settings.
 *
 * This must be called before performing any uploads or other Cloudinary operations.
 *
 * @function
 * @param {Object} config - Cloudinary configuration object.
 * @param {boolean} config.secure - If true, URLs returned will use HTTPS.
 * @param {string} config.cloud_name - Cloudinary cloud name.
 * @param {string} config.api_key - Cloudinary API key.
 * @param {string} config.api_secret - Cloudinary API secret.
 */
cloudinary.v2.config({
    secure: true,
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary and returns the secure URL.
 *
 * @async
 * @function saveToCloudinary
 * @param {Object} file - File object (from multer) to be uploaded.
 * @param {Buffer} file.buffer - The file buffer.
 * @param {string} file.originalname - The original name of the file.
 * @param {string} [folderName] - Optional Cloudinary folder name to store the file.
 *
 * @returns {Promise<string>} Resolves with the secure URL of the uploaded image.
 *
 * @throws {Error} Throws an error if the upload to Cloudinary fails.
 *
 * @example
 * const url = await saveToCloudinary(req.file, "userAvatars");
 * console.log(url); // https://res.cloudinary.com/yourcloud/image/upload/v123456/avatar.jpg
 */
const saveToCloudinary = async (file, folderName = "") => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            resource_type: "image",
        };
        if(folderName) uploadOptions.folder = folderName;
        const stream = cloudinary.v2.uploader.upload_stream( uploadOptions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url);
            }
        });
        stream.end(file.buffer)
    });
}

export default saveToCloudinary;