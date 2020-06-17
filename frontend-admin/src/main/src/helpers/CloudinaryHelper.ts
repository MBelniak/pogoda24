import config from '../config/config';
import { FileToUpload } from '../model/FileToUpload';

const { cloud_name, upload_preset, api_key, api_secret } = config;
export const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;
const sha1 = require('js-sha1');

export function uploadImages(uploadedFiles: FileToUpload[], signal: AbortSignal) {
    return uploadedFiles.map(uploadedFile => {
        if (uploadedFile.file === null) {
            return new Promise<Response>(resolve => {
                resolve();
            });
        }

        const data = prepareDateForFileUpload(
            prepareSignature(uploadedFile.file.name, uploadedFile.timestamp),
            uploadedFile
        );

        return fetch(cloudinaryUrl, {
            method: 'POST',
            body: data,
            signal: signal
        });
    });
}

export function prepareDateForFileUpload(
    signature: string,
    uploadedFile: FileToUpload
): FormData {
    if (uploadedFile.file !== null) {
        const formData = new FormData();
        formData.append('upload_preset', upload_preset);
        formData.append('timestamp', uploadedFile.timestamp);
        formData.append('public_id', uploadedFile.publicId);
        formData.append('api_key', api_key);
        formData.append('file', uploadedFile.file);
        formData.append('signature', signature);

        return formData;
    }
    return new FormData();
}

export function prepareSignature(fileName: string, timestamp: string): string {
    const publicId = fileName + timestamp;
    const hash = sha1.create();
    const stringToSign =
        'public_id=' +
        publicId +
        '&timestamp=' +
        timestamp +
        '&upload_preset=' +
        upload_preset +
        api_secret;
    hash.update(stringToSign);
    return hash;
}
