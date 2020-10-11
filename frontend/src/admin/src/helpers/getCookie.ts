export function getCookie(name) {
    const cks = document.cookie.split('; ');
    for (let x = 0; x < cks.length; x++) {
        const index = cks[x].indexOf('=');
        const nm = cks[x].substring(0, index);
        if (nm == name) {
            return cks[x].substring(index + 1);
        }
    }
    return null;
}

export function saveCookie(name, value) {
    document.cookie = name + '=' + value + '; expires=Thu, 18 Dec 2025 12:00:00 UTC';
}
