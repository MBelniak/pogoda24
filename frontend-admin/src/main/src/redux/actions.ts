export const ADD_FILE = "ADD_FILE";
export const REMOVE_FILE = "REMOVE_FILE";

let fileId = 0;

export const addFile = content => ({
    type: ADD_FILE,
    payload: {
        id: ++fileId,
        file: content
    }
});

export const removeFile = id => ({
    type: REMOVE_FILE,
    payload: { id }
});

