export const ADD_IMAGE = "ADD_IMAGE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

let imageId = 0;

export const addImage = content => ({
    type: ADD_IMAGE,
    payload: {
        id: ++imageId,
        content: content
    }
});

export const removeImage = id => ({
    type: REMOVE_IMAGE,
    payload: { id }
});

