import multer from "multer";
import createHttpError from "http-errors";
import { ALLOWED_FILE_EXTENSIONS, ALLOWED_MIME_TYPES } from "../constants/FILE_EXTENSIONS.js";

/**
 * Multer configuration for handling file uploads.
 *
 * - Uses in-memory storage (`memoryStorage`) instead of saving files directly to disk.
 * - Enforces a maximum file size limit of 5 MB.
 * - Validates uploaded files against a whitelist of allowed extensions and MIME types.
 *
 * @constant
 * @type {multer.StorageEngine}
 */
const storage = multer.memoryStorage();

/**
 * Multer upload limits configuration.
 *
 * @constant
 * @type {Object}
 * @property {number} fileSize - Maximum allowed file size in bytes (5 MB).
 */
const limits = { fileSize: 5 * 1024 * 1024 };

/**
 * File filter callback for Multer.
 *
 * Rejects files that do not match the allowed extensions and MIME types.
 *
 * @function fileFilter
 * @param {import('express').Request} req - The Express request object.
 * @param {Express.Multer.File} file - The uploaded file object.
 * @param {function(Error|null, boolean): void} cb - Callback to indicate whether to accept the file.
 * @returns {void}
 */
const fileFilter = (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop();
    if(!ALLOWED_FILE_EXTENSIONS.includes(fileExtension) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(createHttpError(400, "Invalid file type"), false);
    }
    cb(null, true);
};

/**
 * Multer upload middleware instance.
 *
 * @constant
 * @type {multer.Multer}
 *
 * @example
 * // Usage in Express route
 * app.post('/upload', upload.single('file'), (req, res) => {
 *   res.json({ message: 'File uploaded successfully', file: req.file });
 * });
 */
const upload = multer({ storage, limits, fileFilter });

export default upload;