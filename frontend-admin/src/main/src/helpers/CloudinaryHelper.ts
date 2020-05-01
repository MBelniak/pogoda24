import config from '../config/config';
import { FileToUpload } from '../Writer';

const { cloud_name, upload_preset, api_key, api_secret } = config;
export const controller = new AbortController();
const signal = controller.signal;
const sha1 = require('js-sha1');

export function uploadImages(uploadedFiles: FileToUpload[]) {
    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;

    return uploadedFiles.map(uploadedFile => {
        if (uploadedFile.file === null) {
            return new Promise<Response>(resolve => {
                resolve();
            });
        }
        const signature = prepareSignature(uploadedFile.file.name, uploadedFile.timestamp);
        const formData = new FormData();
        formData.append('upload_preset', upload_preset);
        formData.append('timestamp', uploadedFile.timestamp);
        formData.append('public_id', uploadedFile.publicId);
        formData.append('api_key', api_key);
        formData.append('file', uploadedFile.file);
        formData.append('signature', signature);

        return fetch(url, {
            method: 'POST',
            body: formData,
            signal: signal
        });
    });
}

export function prepareSignature(
    fileName: string,
    timestamp: string
): string {
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
