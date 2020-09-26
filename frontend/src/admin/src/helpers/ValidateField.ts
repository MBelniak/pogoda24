export const validateField = (htmlInput, additionalConstraint?: (value) => boolean) => {
    if (!htmlInput.value || (additionalConstraint ? !additionalConstraint(htmlInput.value) : false)) {
        htmlInput.classList.add('is-danger');
        return false;
    } else {
        htmlInput.classList.remove('is-danger');
        return true;
    }
};