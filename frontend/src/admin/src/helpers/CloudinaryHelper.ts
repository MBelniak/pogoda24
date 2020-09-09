import config from '../config/config';
import { PostImage } from '../model/PostImage';

const { cloud_name, upload_preset, api_key, api_secret } = config;
export const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;
const sha1 = require('js-sha1');

export function uploadImages(postImages: PostImage[], signal: AbortSignal) {
    return postImages
        .filter(image => image.file !== null)
        .map(image => {
            const data = prepareDateForFileUpload(prepareSignature(image.file!.name, image.timestamp), image);

            return fetch(cloudinaryUrl, {
                method: 'POST',
                body: data,
                signal: signal
            });
        });
}

export function prepareDateForFileUpload(signature: string, uploadedFile: PostImage): FormData {
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
        'public_id=' + publicId + '&timestamp=' + timestamp + '&upload_preset=' + upload_preset + api_secret;
    hash.update(stringToSign);
    return hash;
}
