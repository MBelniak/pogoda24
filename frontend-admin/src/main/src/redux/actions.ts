export const SHOW_MODAL = "SHOW_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";

export const showModal = (jsxElement: JSX.Element) => ({
    type: SHOW_MODAL,
    payload: jsxElement
});

export const closeModal = () => ({
    type: CLOSE_MODAL
});
