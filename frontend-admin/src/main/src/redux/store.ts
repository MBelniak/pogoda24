import { createStore } from 'redux';
import { ADD_IMAGE, REMOVE_IMAGE } from "./actions";

interface UploadedPhoto {
    id: number;
    content: File;
}

const uploadedImagesReducer = (uploadedPhotos: UploadedPhoto[] = [], action) => {
    switch (action.type) {
        case ADD_IMAGE:
        {
            let photoIndex = -1;
            const updatedPhotos = uploadedPhotos.map((photo, index) => {
                if (photo.id === action.uploadedPhoto.id) {
                    photoIndex = index;
                    return { ...photo, ...action.uploadedPhoto };
                }

                return photo;
            });

            return photoIndex !== -1
                ? updatedPhotos
                : [action.uploadedPhoto, ...uploadedPhotos];
        }
        case REMOVE_IMAGE:
        {
            const id = action.payload.id;
            uploadedPhotos = uploadedPhotos.filter(uploadedPhoto => uploadedPhoto.id != id);
            return uploadedPhotos;
        }
        default:
            return uploadedPhotos;
    }
}


export const store = createStore(uploadedImagesReducer);

