import { createStore } from 'redux';
import { ADD_FILE, CLEAR_FILES, REMOVE_FILE, MOVE_FILE_BACK, MOVE_FILE_FORWARD } from "./actions";

interface UploadedFile {
    id: number;
    file: File;
    publicId: string
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
        case MOVE_FILE_BACK:
        {
            const id = action.payload.id;
            if (id > 0) {
                uploadedFiles.splice(id - 1, 0, uploadedFiles.splice(id, 1)[0]);
            }
            return [...uploadedFiles];
        }
        case MOVE_FILE_FORWARD:
        {
            const id = action.payload.id;
            if (id < uploadedFiles.length - 1) {
                uploadedFiles.splice(id + 1, 0, uploadedFiles.splice(id, 1)[0]);
            }
            return [...uploadedFiles];
        }
        case CLEAR_FILES:
        {
            return [];
        }
        default:
            return uploadedFiles;
    }
};

export const store = createStore(uploadedFilesReducer);

