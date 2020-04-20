import {
    CLOSE_MODAL,
    SHOW_MODAL
} from './actions';
import { createStore } from 'redux';


export interface ModalWindowState {
    isShown: boolean;
    render?: JSX.Element;
}

const ModalReducer = (
    storeState: ModalWindowState = { isShown: false, render: undefined },
    action
) => {
    switch (action.type) {
        case SHOW_MODAL: {
            return { isShown: true, render: action.payload };
        }
        case CLOSE_MODAL: {
            return { isShown: false, render: undefined };
        }
        default:
            return storeState;
    }
};

export const store = createStore(ModalReducer);
