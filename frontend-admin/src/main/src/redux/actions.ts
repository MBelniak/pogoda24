export const ADD_FILE = "ADD_FILE";
export const REMOVE_FILE = "REMOVE_FILE";
export const MOVE_FILE_BACK = "MOVE_FILE_BACK";
export const MOVE_FILE_FORWARD = "MOVE_FILE_FORWARD";
export const CLEAR_FILES = "CLEAR_FILES";

let fileId = 0;

export const addFile = content => ({
    type: ADD_FILE,
    payload: {
        id: ++fileId,
        file: content,
        publicId: undefined
    }
});

export const removeFile = id => ({
    type: REMOVE_FILE,
    payload: { id }
});

export const moveFileBack = id => ({
    type: MOVE_FILE_BACK,
    payload: { id }
});

export const moveFileForward = id => ({
    type: MOVE_FILE_FORWARD,
    payload: { id }
});

export const clearFiles = () => ({
   type: CLEAR_FILES
});

