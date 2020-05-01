//helper for 'fetch' -> origin always precedes the url provided in call

export const fetchApi = (url, ...params) => {
    if (typeof url === 'string') {
        return window.fetch(location.origin + '/' + url, ...params);
    }
    return window.fetch(url, ...params);
};
