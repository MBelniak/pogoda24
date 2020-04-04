import { createStore } from 'redux';
import { ADD_FILE, REMOVE_FILE } from "./actions";

interface UploadedFile {
    id: number;
    file: File;
}

const uploadedFilesReducer = (uploadedFiles: UploadedFile[] = [], action) => {
    switch (action.type) {
        case ADD_FILE:
        {
            let fileIndex = -1;
            const updatedFiles = uploadedFiles.map((file, index) => {
                if (file.id === action.payload.id) {
                    fileIndex = index;
                    return { ...file, ...action.payload };
                }

                return file;
            });

            return fileIndex !== -1
                ? updatedFiles
                : [...uploadedFiles, action.payload];
        }
        case REMOVE_FILE:
        {
            const id = action.payload.id;
            return uploadedFiles.filter(uploadedFile => uploadedFile.id != id);
        }
        default:
            return uploadedFiles;
    }
};

export const store = createStore(uploadedFilesReducer);

